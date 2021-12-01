import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {Divider, Table} from 'antd';
import config from 'config';
import {msgType} from "../MappingStudyForm";
import {useHistory} from "react-router-dom";
import LayoutWrapper from "../LayoutWrapper";
import {MSPage} from "../MSPage";
import {useSelector} from "react-redux";
// import '../App/App.css';
// import '../static/css/main.css';


function MSAnswers(props) {
    // const {msPapers, selectedCheck} = props;
    const user = useSelector(state => state.authentication.user);
    const paper = props.history.location.state?.paper
    const mappingStudyId = props.history.location.state?.mappingStudyId
    const researchQuestions = props.history.location.state?.researchQuestions
    let answers = {}

    for(let rq in researchQuestions){
        answers[rq.id] = "";
    }

    // const history = useHistory();\

    const insertAnswer = (key,answerText) => {
        console.log("Info: " + key + " " + answerText.target.value);
        answers[key] = answerText.target.value;
    }

    const handleSubmit = () => {
        console.log("Submit Answers");
        console.log(answers);
        // for(let paperId in selectedCheck){
        //     console.log(paperId);
        // }

        // Call Amr API here
        console.log("PAPER ID " + paper.key);
        let data = {
            method: 'POST',
            body: JSON.stringify({
                'userId': user.id,
                'articleId' : paper.key,
                'answers' : researchQuestions.map(q => {return ({
                    'questionId' : q.id,
                    'answer' : answers[q.id]
                })})
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        };
        console.log("JSON: " + data.body.toString());
        fetch(`${config.apiUrl}/mappingStudies/${mappingStudyId}/answerQuestion`, data)
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

    const columns = [
        {
            title: 'Research Question',
            dataIndex: 'question',
            key: 'question',
            render: question => <div>{question}</div>
        },
        {
            title: 'Answer',
            key: 'answer',
            render: (text, rq) => (
                <input
                    type="text"
                    value={answers[rq.key]}
                    onChange={(event) => insertAnswer(rq.key, event)}
                />
            )
        },
    ];
    let rqsData = researchQuestions.map(rq => {
        return ({
            key: rq.id,
            question: rq.question
        })
    });

    return (
        <div>
            <div>{paper.title}</div>
            <Table columns={columns} dataSource={rqsData}/>
            <button type="button" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    )
}

MSAnswers.propTypes = {
    // msPapers: PropTypes.array.isRequired,
    // selectedCheck: PropTypes.func.isRequired
};

//export default MSAnswers;

const WrappedGamePage = LayoutWrapper(MSAnswers);
export default WrappedGamePage;
