import axios from 'axios';
import {useEffect, useState} from 'react';
import { NavLink} from "react-router-dom";
import {useUserContext} from './userContext';
import { ToastContainer, toast } from 'react-toastify';
import validator from "validator";
require('dotenv').config();
const SERVER_URL = process.env.REACT_APP_SERVER_URL


const Profile = () => {

    //const {userId} = useUserIdContext();
    const [profiilAndmed, setProfiilAndmed] = useState({});
    //const [userId, setUserId] = useState();
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [job, setJob] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [changeStatus, setChangeStatus] = useState();
    const [selectedFile, setSelectedFile] = useState();
    //const [profiilAndmed, setProfiilAndmed] = useState({});
    const [havePicture, setHavePicture] = useState(false);
    

    const {userId} = useUserContext();

    // const notify = () => {
    //     if(changeStatus == true) {
    //         toast.success('Andmete salvestamine õnnestus!', {
    //             position: "top-right",
    //             autoClose: 5000,
    //             hideProgressBar: false,
    //             closeOnClick: false,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });
    //     } else {
            
    //     }
       
    // }

    const fileUpload = (e) => {
        
        e.preventDefault();
        let data = new FormData();

        data.append("file", selectedFile);
        data.append("userid", userId);

        console.log(data.get("file"));

        console.log("SEE ON KASUTAJAID JAH: " + userId);

        fetch(`${SERVER_URL}/uploadimage`, {
            method: "POST",
            body: data,
        })
        .then((result) => {
            console.log("File Sent Successful");
            console.log(result.data + "ON KASUTAJA DATA");
           
        })
        .catch((err) => {
            console.log(err);
        });

        
    } 

    useEffect(() => {
        if(userId !== undefined) {
            axios.post(`${SERVER_URL}/getKasutaja`, {
                kasutajaid: userId
            }).then((response) => {
                setProfiilAndmed(response.data);
            }).catch((error) => {
                console.log(error);
            })
        }
    }, [userId]);

    const ImageAddr = "uploads/images/" + profiilAndmed.profilepicture + ".jpg";
    const defaultImageAddr = "uploads/images/defaultpic.png";
        

    useEffect(() => {
        if(profiilAndmed !== undefined) {
            console.log("PROFILEPIC: " + profiilAndmed.profilepicture);
            if(profiilAndmed.profilepicture != null || profiilAndmed.profilepicture != undefined) {
                setHavePicture(true);
            }
        }
    }, [profiilAndmed]);

    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const changeProfile = () => {
        if (validator.isEmail(email) || email == "") {
            axios.post(`${SERVER_URL}/changeprofile`, {
                email: email,
                phone: phone,
                job: job,
                firstName: firstName,
                lastName: lastName,
                userid: userId
            }).then((response) => {
                console.log("SEE ON RESPONSE: " + JSON.stringify(response.data));
                console.log("Response code: " + response.status);
                if (JSON.stringify(response.data.msg)) {
                    setChangeStatus(true);
                    if (response.status == 200) {
                        toast.success('Andmete salvestamine õnnestus!', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    } else {
                        toast.error('Midagi läks valesti!', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }

                    console.log("SEE ON CHANGESTATUS: " + changeStatus);
                }

                //history.push("/login");
                //window.location.reload();
            }, (error) => {
                console.log(error);
                setChangeStatus(false);
            })

            axios.post(`${SERVER_URL}/useridtest`, {
                kasutajaid: userId
            }).then((response) => {
                console.log("SEE RESPONSE: " + JSON.stringify(response.data));
            })
        } else {
            toast.error('Email ei ole korrektne!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    // useEffect(() => {
    //     if (changeStatus) {
    //         toast.success('Andmete salvestamine õnnestus!', {
    //             position: "top-right",
    //             autoClose: 5000,
    //             hideProgressBar: false,
    //             closeOnClick: false,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });
    //     }

       
    // }, [changeStatus])



    return(
        <section className="profile-container">
           <section className="profile-card">
               <section className="pic-button">
                {/* <img src='https://via.placeholder.com/300.png/09f/fff' alt='profilepic'></img> */}
                <form onSubmit={fileUpload} encType="multipart/form-data">
                <div className="1">
                {havePicture ? <img src={process.env.PUBLIC_URL + ImageAddr} alt='profilepic'></img> : <img src={process.env.PUBLIC_URL + defaultImageAddr} alt='profilepic'></img>} 
                </div>
                    <input type='file' className="input-but" onChange={e => {onFileChange(e)}}/>
                    {/* <input type="text" value={userId} /> */}
                    <button id='changepic' className='reg-but' type='submit'>Muuda pilti</button>
                </form>
                </section>
                <h2>{profiilAndmed.eesnimi} {profiilAndmed.perenimi}</h2>
                <h4>{profiilAndmed.kasutajaroll}</h4>
                <br/>
                <NavLink className="profile-button" to="/profile">Profiil</NavLink>
                <NavLink className="profile-button" to="/oppematerjalid">Õppematerjalid</NavLink>
                <NavLink className="profile-button" to="/minu-kysimustikud">Minu küsimustikud</NavLink>
                <NavLink className="profile-button" to='/muudaprofiili'>Muuda profiili</NavLink>
            </section>
            <section className="profile-container-1">
                <h1 className="profiil">Muuda profiili</h1>
            <section className="profile-edit-data">
                <label>
                <h3>Eesnimi</h3>
                <input className="email-input" placeholder="Eesnimi" type="text" name="firstName" id="firstName" onChange={e => {setFirstName(e.target.value)}}/>
                </label>
                <label>
                <h3>Perekonnanimi</h3>
                <input className="email-input" placeholder="Perekonnanimi" type="text" name="lastName" id="lastName" onChange={e => {setLastName(e.target.value)}}/>
                </label>
                <label>
                <h3>E-mail</h3>
                <input className="email-input" placeholder="E-mail" type="email" name="email" id="email" onChange={e => {setEmail(e.target.value)}}/>
                </label>
                <label>
                <h3>Töökoht</h3>
                <input className="email-input" placeholder="Tookoht" type="text" name="job" id="job" onChange={e => {setJob(e.target.value)}}/>
                </label>
                <label>
                <h3>Telefon</h3>
                <input className="email-input" placeholder="Telefon" type="tel" name="phone" id="phone" onChange={e => {setPhone(e.target.value)}}/>
                </label>
                <br/>
                <button id="register-button" className="reg-but" type='submit' onClick={changeProfile}>Salvesta</button>
                
                {/* <h5>{changeStatus}</h5> */}
            </section>
        </section>
        </section>
    );
    
}
export default Profile;