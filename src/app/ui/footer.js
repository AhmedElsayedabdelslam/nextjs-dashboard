"use client";
import React from "react";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* اليمين */}
        <div style={styles.section}>
          <h4 style={styles.title}>Clinic System</h4>
          <p>Your trusted platform for diagnosis, medicines, and hospital services.</p>
        </div>

        {/* النص */}
        <div style={styles.section}>
          <h4 style={styles.title}>Quick Links</h4>
          <ul style={styles.list}>
            <li><a href="#" style={styles.link}>Home</a></li>
            <li><a href="#" style={styles.link}>Diagnosis</a></li>
            <li><a href="#" style={styles.link}>Medicines</a></li>
            <li><a href="#" style={styles.link}>Hospitals</a></li>
            <li><a href="#" style={styles.link}>Profile</a></li>
          </ul>
        </div>

        {/* الشمال */}
        <div style={styles.section}>
          <h4 style={styles.title}>Contact Us</h4>
          <p>Email: support@clinicsystem.com</p>
          <p>Phone: +123 456 789</p>
        </div>
      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} Clinic System. All rights reserved.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#007bff",
    color: "#fff",
    padding: "20px 0",
    marginTop: "20px"
  },
  container: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    textAlign: "left",
    padding: "0 20px"
  },
  section: {
    flex: "1",
    minWidth: "200px",
    margin: "10px"
  },
  title: {
    fontSize: "18px",
    marginBottom: "10px"
  },
  list: {
    listStyle: "none",
    padding: 0
  },
  link: {
    color: "#fff",
    textDecoration: "none"
  },
  bottom: {
    textAlign: "center",
    marginTop: "10px",
    fontSize: "14px",
    borderTop: "1px solid rgba(255,255,255,0.3)",
    paddingTop: "10px"
  }
};
