import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {Button, Divider, Table} from 'antd';
import config from 'config';
import {msgType} from "../MappingStudyForm";
import {useHistory} from "react-router-dom";
import LayoutWrapper from "../LayoutWrapper";
import {MSPage} from "../MSPage";
import {useSelector} from "react-redux";
// import '../App/App.css';
// import '../static/css/main.css';


function MSShare(props) {
    // const {msPapers, selectedCheck} = props;
    const user = useSelector(state => state.authentication.user);
    const mappingStudyId = props.history.location.state?.mappingStudyId
    let emailToShare;

    const insertEmail = (emailText) => {
        console.log("Info: " + emailText.target.value);
        emailToShare = emailText.target.value;
    }

    const handleSubmit = () => {
        console.log("Submit Email");
        console.log(emailToShare);
        // for(let paperId in selectedCheck){
        //     console.log(paperId);
        // }

        // Call Amr API here
        let data = {
            method: 'POST',
            // body: JSON.stringify({
            //     'userId': user.id,
            //     'articleId' : paper.key,
            //     'answers' : researchQuestions.map(q => {return ({
            //         'questionId' : q.id,
            //         'answer' : answers[q.id]
            //     })})
            // }),
            headers: {
                'Content-Type': 'application/json',
            }
        };
        fetch(`${config.apiUrl}/mappingStudies/${mappingStudyId}/share?userId=${user.id}&toEmail=${emailToShare}`, data)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                // else {
                //     throw new Error("EmailOfCreator must be unique.")
                // }
            })
            .then(data => {
                console.log("Successful Submission" + data);
                if(data == false){
                    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                    //Show message that the selection failed
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div>
            <div>Share it with your colleague!</div>
            <input
                type="text"
                value={emailToShare}
                onChange={(event) => insertEmail(event)}
            />
            {/*<button type="button" onClick={handleSubmit}>*/}
            {/*    Submit*/}
            {/*</button>*/}
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    )
}

MSShare.propTypes = {
    // msPapers: PropTypes.array.isRequired,
    // selectedCheck: PropTypes.func.isRequired
};

//export default MSAnswers;

const WrappedGamePage = LayoutWrapper(MSShare);
export default WrappedGamePage;
