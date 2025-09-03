/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Sanjana
 */
@WebServlet(name = "NewAccount", urlPatterns = {"/NewAccount"})
public class NewAccount extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject user = gson.fromJson(request.getReader(), JsonObject.class);

        String fullName = user.get("fullName").getAsString();
        String email = user.get("email").getAsString();
        String password = user.get("password").getAsString();
        String confirmPassword = user.get("confirmPassword").getAsString();

        System.out.println(fullName);
        System.out.println(email);
        System.out.println(password);
        System.out.println(confirmPassword);

        JsonObject responJsonObject = new JsonObject();
        responJsonObject.addProperty("status", false);

        if (fullName.isEmpty()) {
            responJsonObject.addProperty("message", "Enter full name!");
        } else if (email.isEmpty()) {
            responJsonObject.addProperty("message", "Enter email address!");
        } else if (!Util.isEmailValid(email)) {
            responJsonObject.addProperty("message", "Enter valid email!");
        } else if (password.isEmpty()) {
            responJsonObject.addProperty("message", "Enter password!");
        } else if (!Util.isPasswordValid(password)) {
            responJsonObject.addProperty("message",
                    "The password must contain at least uppercase, lowercase, number, special character and be 8 characters long!");
        } else if (!password.equals(confirmPassword)) {
            responJsonObject.addProperty("message", "Password didn't match!");
        } else {
            Session session = HibernateUtil.getSessionFactory().openSession();
            try {

                Criteria c = session.createCriteria(User.class);
                c.add(Restrictions.eq("user_email", email));
                List<User> ulist = c.list();

                if (!ulist.isEmpty()) {

                    responJsonObject.addProperty("message", "Email already exists! Try another one.");

                } else {

                    User u = new User();
                    u.setFull_name(fullName);
                    u.setPassword(confirmPassword);
                    u.setUser_email(email);

                    session.save(u);
                    session.beginTransaction().commit();

                    responJsonObject.addProperty("status", true);
                    responJsonObject.addProperty("message", "Successfully created account!");

                    session.close();

                }

            } catch (Exception e) {

                e.printStackTrace();

            }

        }

        // set response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responJsonObject));
    }

}
