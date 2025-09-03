/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Tasks;
import hibernate.Type;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
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
@WebServlet(name = "DailyTasks", urlPatterns = {"/DailyTasks"})
public class DailyTasks extends HttpServlet {

//    @Override
//    protected void doPost(HttpServletRequest request, HttpServletResponse response)
//            throws ServletException, IOException {
//
//        Gson gson = new Gson();
//        JsonObject responseObject = new JsonObject();
//        JsonObject resquestObject = gson.fromJson(request.getReader(), JsonObject.class);
//
//        String userEmail = resquestObject.get("email").getAsString();
//        String[] tasksName = gson.fromJson(resquestObject.get("taskName"), String[].class);
//        String taskTittle = resquestObject.get("title").getAsString();
//        String date = resquestObject.get("date").getAsString();
//
//        System.out.println(String.join(",", tasksName));
//        System.out.println(date);
//        System.out.println(userEmail);
//        System.out.println(taskTittle);
//
//        responseObject.addProperty("status", false);
//
//        if (userEmail == null) {
//
//            resquestObject.addProperty("message", "Login First!");
//            return;
//        }
//
//        if (taskTittle.isEmpty()) {
//
//            responseObject.addProperty("message", "Please enter tittle!");
//
//        } else {
//
//            Session session = HibernateUtil.getSessionFactory().openSession();
//            Criteria c = session.createCriteria(User.class);
//            c.add(Restrictions.eq("user_email", userEmail));
//
//            List<User> users = c.list();
//
//            if (users.isEmpty()) {
//
//                responseObject.addProperty("message", "User not found");
//
//            }
//
//            Type type = (Type) session.get(Type.class, 1);
//
//            for (int i = 0; i < tasksName.length; i++) {
//
//                Tasks tasks = new Tasks();
//                tasks.setTask_name(tasksName);
//                tasks.setTask_tittle(task_tittle);
//                tasks.setType_id(type);
//                tasks.setUser_id(user_id);
//                
//                
//            }
//
//        }
//
//    }
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        JsonObject requestObject = gson.fromJson(request.getReader(), JsonObject.class);

        String userEmail = requestObject.get("email").getAsString();
        String[] tasksName = gson.fromJson(requestObject.get("taskName"), String[].class);
        String taskTitle = requestObject.get("title").getAsString();
        String dateString = requestObject.get("date").getAsString();

        System.out.println(userEmail);
        System.out.println(tasksName);
        System.out.println(taskTitle);
        System.out.println(dateString);

        responseObject.addProperty("status", false);

        if (userEmail == null || userEmail.isEmpty()) {
            responseObject.addProperty("message", "Login First!");

            return;
        }

        if (taskTitle == null || taskTitle.isEmpty()) {
            responseObject.addProperty("message", "Please enter title!");

            return;
        }

        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tx = session.beginTransaction();

        Criteria c = session.createCriteria(User.class);
        c.add(Restrictions.eq("user_email", userEmail));
        List<User> users = c.list();

        if (users.isEmpty()) {
            responseObject.addProperty("message", "User not found");

            return;
        }

        User user = users.get(0);

        // Parse date
        Date taskDate = null;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            taskDate = sdf.parse(dateString);
        } catch (Exception e) {
            responseObject.addProperty("message", "Invalid date format");

            return;
        }

        // Get default Type
        Type type = (Type) session.get(Type.class, 2);

        for (String taskName : tasksName) {
            Tasks task = new Tasks();
            task.setTask_name(taskName);
            task.setTask_tittle(taskTitle);
            task.setCreated_at(taskDate);
            task.setType_id(type);
            task.setUser_id(user);

            session.save(task);
        }

        tx.commit();
        session.close();

        responseObject.addProperty("status", true);
        responseObject.addProperty("message", "Tasks saved successfully!");
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }

}
