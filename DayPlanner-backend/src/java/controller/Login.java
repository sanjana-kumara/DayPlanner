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
import java.util.AbstractList;
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
@WebServlet(name = "Login", urlPatterns = {"/Login"})
public class Login extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson g = new Gson();
        JsonObject requestObject = g.fromJson(request.getReader(), JsonObject.class);
        JsonObject responseObject = new JsonObject();

        String email = requestObject.get("email").getAsString();
        String password = requestObject.get("password").getAsString();

        System.out.println(email);
        System.out.println(password);

        responseObject.addProperty("status", false);

        if (email.isEmpty()) {

            responseObject.addProperty("message", "Enter user email!");

        } else if (!Util.isEmailValid(email)) {

            responseObject.addProperty("message", "Enter valide email!");

        } else if (password.isEmpty()) {

            responseObject.addProperty("message", "Enter user password!");

        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();

            Criteria users = session.createCriteria(User.class);
            users.add(Restrictions.eq("user_email", email));
            users.add(Restrictions.eq("password", password));

            List<User> userlist = users.list();

            if (userlist.isEmpty()) {

                responseObject.addProperty("message", "Invalide email or password!");

            } else {

                User u = userlist.get(0);
                responseObject.addProperty("message", "Login successfull!");
                responseObject.addProperty("userName", u.getFull_name());
                responseObject.addProperty("status", true);

            }

            session.close();

        }

        response.setContentType("application/json");
        response.getWriter().write(g.toJson(responseObject));

    }

}
