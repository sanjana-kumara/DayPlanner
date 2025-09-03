/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Tasks;
import hibernate.Type;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Sanjana
 */
@WebServlet(name = "Dashboard", urlPatterns = {"/Dashboard"})
public class Dashboard extends HttpServlet {

    private final Gson gson = new Gson();
    private static final SimpleDateFormat DF = new SimpleDateFormat("yyyy-MM-dd");

    private void sendJson(HttpServletResponse response, JsonObject obj) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.write(gson.toJson(obj));
        out.flush();
    }

    // GET /Dashboard?email=...
    // -> returns groups: [{ title, date, tasks: [{id,name,type}] }]
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");
        JsonObject resp = new JsonObject();

        Session session = HibernateUtil.getSessionFactory().openSession();

        Criteria cu = session.createCriteria(User.class);
        cu.add(Restrictions.eq("user_email", email));
        List<User> users = cu.list();

        if (users.isEmpty()) {
            resp.addProperty("status", false);
            resp.addProperty("message", "User not found");
            session.close();
            sendJson(response, resp);
            return;
        }

        User user = users.get(0);

        Criteria ct = session.createCriteria(Tasks.class);
        ct.add(Restrictions.eq("user_id", user));
        @SuppressWarnings("unchecked")
        List<Tasks> all = ct.list();

        // Group by title + date
        Map<String, JsonObject> groups = new LinkedHashMap<>();
        for (Tasks t : all) {
            // NOTE:
            // Assumes your Tasks entity has getters: getTask_tittle(), getDate()
            // If your column names are created_at etc., map accordingly.
            String dateStr = DF.format(t.getCreated_at());
            String title = t.getTask_tittle();

            String key = title + "||" + dateStr;
            if (!groups.containsKey(key)) {
                JsonObject group = new JsonObject();
                group.addProperty("title", title);
                group.addProperty("date", dateStr);
                group.add("tasks", new JsonArray());
                groups.put(key, group);
            }

            JsonObject tJson = new JsonObject();
            tJson.addProperty("id", t.getId());
            tJson.addProperty("name", t.getTask_name());
            tJson.addProperty("type", t.getType_id().getType_id()); // 1=Complete, 2=Not_Complete
            groups.get(key).getAsJsonArray("tasks").add(tJson);
        }

        resp.addProperty("status", true);
        resp.add("groups", gson.toJsonTree(groups.values()));

        session.close();
        sendJson(response, resp);
    }

    // PUT /Dashboard  body: { taskId, completed }
    // -> toggle checkbox (completed=true => type=1, else type=2)
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JsonObject body = gson.fromJson(request.getReader(), JsonObject.class);
        int taskId = body.get("taskId").getAsInt();
        boolean completed = body.get("completed").getAsBoolean();
        int typeId = completed ? 1 : 2; // 1=Complete, 2=Not_Complete

        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tx = session.beginTransaction();

        Tasks task = (Tasks) session.get(Tasks.class, taskId);
        Type type = (Type) session.get(Type.class, typeId);

        JsonObject resp = new JsonObject();
        if (task != null && type != null) {
            task.setType_id(type);
            session.update(task);
            tx.commit();
            resp.addProperty("status", true);
            resp.addProperty("message", "Task updated");
        } else {
            resp.addProperty("status", false);
            resp.addProperty("message", "Task or Type not found");
        }

        session.close();
        sendJson(response, resp);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JsonObject body = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject resp = new JsonObject();

        if (body.has("action") && "delete".equals(body.get("action").getAsString())) {
            handleDelete(body, response);
            return;
        }

        // else: you can add other POST actions if needed
        resp.addProperty("status", false);
        resp.addProperty("message", "Invalid POST action");
        sendJson(response, resp);
    }

    private void handleDelete(JsonObject body, HttpServletResponse response) throws IOException {
        String email = body.get("email").getAsString();
        String title = body.get("title").getAsString();
        String dateStr = body.get("date").getAsString();

        JsonObject resp = new JsonObject();
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tx = session.beginTransaction();

        try {
            Criteria cu = session.createCriteria(User.class);
            cu.add(Restrictions.eq("user_email", email));
            List<User> users = cu.list();

            if (users.isEmpty()) {
                resp.addProperty("status", false);
                resp.addProperty("message", "User not found");
            } else {
                User user = users.get(0);

                Criteria ct = session.createCriteria(Tasks.class);
                ct.add(Restrictions.eq("user_id", user));
                ct.add(Restrictions.eq("task_tittle", title));
                ct.add(Restrictions.eq("created_at", java.sql.Date.valueOf(dateStr)));

                @SuppressWarnings("unchecked")
                List<Tasks> tasks = ct.list();

                for (Tasks t : tasks) {
                    session.delete(t);
                }

                tx.commit();
                resp.addProperty("status", true);
                resp.addProperty("message", "Task group deleted");
            }
        } catch (Exception e) {
            tx.rollback();
            resp.addProperty("status", false);
            resp.addProperty("message", "Error: " + e.getMessage());
        } finally {
            session.close();
        }

        sendJson(response, resp);
    }

}
