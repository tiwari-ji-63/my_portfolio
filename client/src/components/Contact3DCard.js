import React from "react";
import './Contact3DCard.css';

export default function Contact3DCard({ contact }) {
  return (
    <div className="contact-3d-card">
      <div className="contact-3d-card__inner">
        <div className="contact-3d-card__front">
          <h2 className="contact-3d-card__title">Contact Details</h2>
          <ul className="contact-3d-card__list">
            <li><span>Name :</span> {contact.name}</li>
            <li><span>Age :</span> {contact.age}</li>
            <li><span>Gender :</span> {contact.gender}</li>
            <li><span>Email :</span> {contact.email}</li>
            <li><span>Mobile :</span> {contact.mobile}</li>
            <li><span>Address :</span> {contact.address}</li>
          </ul>
        </div>
        <div className="contact-3d-card__back">
          <h3 className="contact-3d-card__thanks">Thank you!</h3>
        </div>
      </div>
    </div>
  );
}
