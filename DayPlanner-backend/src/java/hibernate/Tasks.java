/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hibernate;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.crypto.Data;

/**
 *
 * @author Sanjana
 */
@Entity
@Table(name = "tasks")
public class Tasks implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private int id;

    @Column(name = "task_name", nullable = true)
    private String task_name;

    @Column(name = "created_at", nullable = true)
    private Date created_at;

    @Column(name = "task_tittle", length = 100, nullable = true)
    private String task_tittle;

    @ManyToOne
    @JoinColumn(name = "user_user_id")
    private User user_id;

    @ManyToOne
    @JoinColumn(name = "task_type_type_id")
    private Type type_id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTask_name() {
        return task_name;
    }

    public void setTask_name(String task_name) {
        this.task_name = task_name;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    public String getTask_tittle() {
        return task_tittle;
    }

    public void setTask_tittle(String task_tittle) {
        this.task_tittle = task_tittle;
    }

    public User getUser_id() {
        return user_id;
    }

    public void setUser_id(User user_id) {
        this.user_id = user_id;
    }

    public Type getType_id() {
        return type_id;
    }

    public void setType_id(Type type_id) {
        this.type_id = type_id;
    }

}
