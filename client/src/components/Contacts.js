import React from 'react'
import { Link } from "react-router-dom";

const Contacts = (props) => (
    <Link to={`/chat/${props.chatURL}/`} style={{ color: "#fff" }}>
        <li className="contact">
            <div className="wrap">
                <img src="https://www.netfort.com/assets/user.png" alt="" />
                <div className="meta">
                    <p className="name">{props.chatname}</p>
                </div>
            </div>
        </li>
    </Link>
)

export default Contacts
