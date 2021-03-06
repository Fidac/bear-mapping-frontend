import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {Button, Divider, Table} from 'antd';
import Select from 'react-select';
import dateformat from "dateformat";
import config from 'config';
import {msgType} from "../MappingStudyForm";
import {useHistory} from "react-router-dom";
import LayoutWrapper from "../LayoutWrapper";
import {MSPage} from "../MSPage";
import {useSelector} from "react-redux";
import parse from "html-react-parser";
import {Icon, Layout, Menu} from "antd";

const {Header, Content, Footer, Sider} = Layout;


function MSShowAnswers(props) {
    // const {msPapers, selectedCheck} = props;
    const paper = props.history.location.state?.paper
    const mappingStudyId = props.history.location.state?.mappingStudyId
    const researchQuestions = props.history.location.state?.researchQuestions
    const selectedCheck = props.history.location.state?.selectedCheckParameter;
    const selectedUnPick = props.history.location.state?.unselectedCheckParameter;
    const user = useSelector(state => state.authentication.user);
    const history = useHistory();
    // let answers = props.history.location.state?.answers;
    // let users = props.history.location.state?.users;
    // let usersName = props.history.location.state?.usersName;
    let info = props.history.location.state?.info;
    let msPapers = props.history.location.state?.msPapers
    let researchQuestionId = props.history.location.state?.researchQuestionId;
    // let researchQuestionId;
    // researchQuestions.map(rq =>  answers[rq.id] = {})

    // for(let rq in researchQuestions){
    //     answers[rq.id] = {};
    // }

    console.log("Initialization: ");
    console.log("Info: " + info);


    const fetchPaperAnswers = (rqId) => {
        console.log("FETCH ANSWERS");
        // Call Amr API to get the answers
        fetch(`${config.apiUrl}/mappingStudies/${mappingStudyId}/answerQuestion/${rqId}?userId=${user.id}&articleId=${paper.key}`)
            .then(res => {
                if (res.ok){
                    return res.json();
                } else {
                    throw new Error("Error while fetching Answers");
                }
            })
            .then(data => {
                // data.map(d => {
                //     console.log("RESPONSE: " + rqId);
                //     answers[rqId][d.userId] = d;
                //     console.log("Saved in DIC");
                //     users.push(d.userId);
                //     usersName[d.userId] = d.userName;
                //     console.log(users);
                //     console.log(usersName);
                // })
                console.log("Getting ANSWERS..." + data);
                history.push({pathname: "/showAnswers", state: {msPapers: msPapers, paper: paper, mappingStudyId: mappingStudyId, researchQuestions: researchQuestions, info:data, researchQuestionId: rqId, selectedCheckParameter: selectedCheck, unselectedCheckParameter: selectedUnPick} });
            })
            .catch(error => {
                console.log("ERROR " + error);
                // setStatusMsgType(msgType.ERROR);
                // setStatusMsg(error.toString());
            });
    };

    useEffect(() => {
        // for(let rq in researchQuestions){
        //     console.log("FETCHING..." + rq)
        //     fetchPaperAnswers(rq);
        // }
        // researchQuestions.map(rq => fetchPaperAnswers(rq.id));
    }, []);
    // const history = useHistory();\

    const getOptions = () => {
        // let tempArray = [];
        console.log("LISTING:");
        // console.log(paperData);

        // let rqs = paperData[0].researchQuestions;

        //tempArray.push(<option>All</option>);
        // for(var i = 0; i < rqs.length; i++){
        //     tempArray.push(<option>{rqs[i].question}</option>);
        // }

        // console.log("MS-ID")
        // console.log(paperData[0])
        const options = researchQuestions.map(rq => ({
            "value" : rq.id,
            "label" : rq.question
        }))

        console.log(options);
        return options;
    }

    const handleChange = (e) => {
        console.log("CHANGEEEEEEE");
        console.log(e);
        fetchPaperAnswers(e.value);
        //history.push({pathname: "/showAnswers", state: {paper: paper, mappingStudyId: mappingStudyId, researchQuestions: researchQuestions} });
    }

    const handleBack = () => {
        console.log("MSPapers: " + msPapers);
        console.log("Mapping Study: " + mappingStudyId);
        history.push({pathname: "/list", state: {msPapers: msPapers, mappingStudyId: mappingStudyId, selectedCheckParameter: selectedCheck, unselectedCheckParameter: selectedUnPick } });
    }

    const columns = [
        {
            title: 'Users',
            dataIndex: 'name',
            key: 'name',
            render: name => <div>{name}</div>
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            key: 'answer',
            render: answer => <div>{parse(answer)}</div>
        }
    ];
    // let answersData = [];
    // info.map(ra => {
    //     console.log("USER: " + ra);
    //     answersData.push({
    //         key: ra.userId,
    //         name: ra.userName,
    //         answer: ra.answer
    //     })
    // })
    let answersData = info.map(ra => {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA " + ra.userId);
        console.log("INFO " + ra.answer);
        return ({
            key: ra.userId,
            name: ra.userName,
            answer: ra.answer
        })
    });

    return (
        <div>
            <Header className="header" style={{background: '#e6f7ff', padding: 0, textAlign: 'center'}}>
                <span>{paper.title}</span>
            </Header>
            <Select options={getOptions()} onChange={handleChange}/>
            <Table columns={columns} dataSource={answersData}/>
            {/*<button type="button" onClick={handleBack}>*/}
            {/*    Go Back*/}
            {/*</button>*/}
            <Button type="primary" htmlType="submit" onClick={handleBack}>
                Go Back
            </Button>
        </div>
    )
}

MSShowAnswers.propTypes = {
    // msPapers: PropTypes.array.isRequired,
    // selectedCheck: PropTypes.func.isRequired
};

//export default MSAnswers;

const WrappedGamePage = LayoutWrapper(MSShowAnswers);
export default WrappedGamePage;
