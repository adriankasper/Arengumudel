import React, { useState } from 'react';
import { Switch } from 'react-router';
import Profilecard from './Profilecard';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';



const Contact = () => {
    const [status, setStatus] = useState('Submit');
    const [msgStatus, setMsgStatus] = useState(false);
    const [contactMessage, setContactMessage] = useState('Midagi läks valesti');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [captchaValue, setCaptchaValue] = useState('');
    const sitekey = "6LfGmI0mAAAAAG2NgQ6DOoYBf71q8lqksfPWqy8n";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaValue) {
            toast.error('Palun veenduge, et te ei ole robot.');
            return;
        }

        setStatus('Sending...');
        const { name, email, message } = e.target.elements;
        let details = {
            name: name.value,
            email: email.value,
            message: message.value,
            captchaValue: captchaValue,
        };
        let response = await fetch('/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(details),
        }).then((result) => {
            setStatus('Submit');
            if (result.status === 200) {
                setContactMessage('Kiri saadetud!');
                setMsgStatus(true);
                toast.success('Kiri saadetud!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error('Midagi läks valesti!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        });
    };

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <section className="profile-contact">
                <Switch>
                    <Profilecard />
                </Switch>
                <section className="contact">
                    <section className="contact-heading">
                        <h1>Kontakteeru meiega!</h1>
                    </section>
                    <section className="contact-form">
                        <label>Nimi</label>
                        <input type="text" id="name" name="name" placeholder="Nimi" required />
                        <label>Email</label>
                        <input type="email" id="email" name="email" placeholder="E-mail" />
                        <label>Teema</label>
                        <textarea id="message" name="message" rows="6" cols="80"></textarea>
                        <div className="captcha-container">
                            <ReCAPTCHA
                                sitekey={sitekey}
                                onChange={handleCaptchaChange}
                                hl="et"
                            />
                        </div>
                        <br></br>
                        <button className="contact-button" type="submit" id="button" value="Submit">
                            Saada
                        </button>
                    </section>
                </section>
            </section>
        </form>
    );
};

export default Contact;