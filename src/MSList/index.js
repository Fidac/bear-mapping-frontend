import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {Button, Divider, Table} from 'antd';
import Select from 'react-select';
import config from 'config';
import {msgType} from "../MappingStudyForm";
import {useHistory} from "react-router-dom";
import LayoutWrapper from "../LayoutWrapper";
import {MSPage} from "../MSPage";
import dateformat from "dateformat";
import {useSelector} from "react-redux";
import {isEmpty} from "../utils/utils";
// import '../App/App.css';
// import '../static/css/main.css';


function MSList(props) {
    // const {msPapers, selectedCheck} = props;
    const user = useSelector(state => state.authentication.user);
    let msPapers = props.history.location.state?.msPapers
    // let selectedCheck = props.history.location.state?.selectedCheck
    const mappingStudyId = props.history.location.state?.mappingStudyId
    let selectedCheck = new Set();
    let unselectedChecks = new Set();
    let selectedUnPick = new Set();
    let unselectedUnPick = new Set();

    for(const temp of msPapers){
        // console.log("Processing: ", temp);
        unselectedChecks.add(temp.id);
    }


    const history = useHistory();

    const toggleCheckbox = (key) => {
        console.log("Storing paper: " + key);
        console.log("Selected: ", selectedCheck);
        console.log("Not Selected: ", unselectedChecks);

        if (!selectedCheck.has(key)) {
            unselectedChecks.delete(key)
            selectedCheck.add(key);
        } else {
            unselectedChecks.add(key);
            selectedCheck.delete(key);
        }
    }

    const toggleCheckboxUnpick = (key) => {
        console.log("Storing paper: " + key);
        console.log("Selected: ", selectedUnPick);
        console.log("Not Selected: ", unselectedUnPick);

        if (!selectedUnPick.has(key)) {
            unselectedUnPick.delete(key)
            selectedUnPick.add(key);
        } else {
            unselectedUnPick.add(key);
            selectedUnPick.delete(key);
        }
    }

    const getOptions = () => {
        // let tempArray = [];
        console.log("LISTING:");
        console.log(paperData);

        let rqs = paperData[0].researchQuestions;

        //tempArray.push(<option>All</option>);
        // for(var i = 0; i < rqs.length; i++){
        //     tempArray.push(<option>{rqs[i].question}</option>);
        // }

        // console.log("MS-ID")
        // console.log(paperData[0])
        const options = rqs.map(rq => ({
            "value" : rq.id,
            "label" : rq.question
        }))

        console.log(options);
        return options;
    }

    const handleChange = (e) => {
        console.log("CHANGEEEEEEE");
        console.log(e);
        fetch(`${config.apiUrl}/mappingStudies/${mappingStudyId}/researchQuestionsWeights/${e.value}?userId=${user.id}`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                // else {
                //     throw new Error("EmailOfCreator must be unique.")
                // }
            })
            .then(data => {
                console.log("URL" + `${config.apiUrl}/mappingStudies/${mappingStudyId}/researchQuestionsWeights/${e.value}?userId=${user.id}`);
                console.log("RECEIVING WEIGHTS!!!")
                console.log(msPapers[0].weight)
                history.push({pathname: "/list", state: {msPapers: data, mappingStudyId: mappingStudyId , selectedCheck: selectedCheck} });
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleSubmit = () => {
        console.log("Submit Selection");
        console.log(selectedCheck);
        // for(let paperId in selectedCheck){
        //     console.log(paperId);
        // }

        // Call Amr API here
        let data = {
            method: 'POST',
            body: JSON.stringify({
                'userId': user.id,
                'pickedArticleIds' : [...selectedCheck],
                'unPickedArticleIds' : [...selectedUnPick]
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        };
        fetch(`${config.apiUrl}/mappingStudies/${mappingStudyId}/articleSelection`, data)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                // else {
                //     throw new Error("EmailOfCreator must be unique.")
                // }
            })
            .then(data => {
                console.log("Successful Submission " + data);
                // if(data == false){
                //     //Show message that the selection failed
                // }
                history.push({pathname: "/list", state: {msPapers: data, mappingStudyId: mappingStudyId , selectedCheck: selectedCheck} });
                // window.location.reload(true);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleSort = () => {
        console.log("SORTING BY CONSENSUS");
        // Call Amr API here
        let data = {
            method: 'GET',
            // body: JSON.stringify({
            //     'userId': user.id,
            // }),
            headers: {
                'Content-Type': 'application/json',
            }
        };
        fetch(`${config.apiUrl}/mappingStudies/${mappingStudyId}/articles/consensus?userId=${user.id}`, data)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                // else {
                //     throw new Error("EmailOfCreator must be unique.")
                // }
            })
            .then(data => {
                console.log("Successful Sort")
                if(data == false){
                    //Show message that the selection failed
                }
                history.push({pathname: "/list", state: {msPapers: data, mappingStudyId: mappingStudyId , selectedCheck: selectedCheck} });
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleAnswer = (paper) => {
        console.log("Handle Answer");
        history.push({pathname: "/answers", state: {paper: paper, mappingStudyId: mappingStudyId, researchQuestions: paperData[0].researchQuestions} });
    }

    const handleShowAnswers = (paper) => {
        console.log("Handle Show Answer");
        // let answers = {};
        // paperData[0].researchQuestions.map(rq => answers[rq.id] = {});
        history.push({pathname: "/showAnswers", state: {paper: paper, mappingStudyId: mappingStudyId, researchQuestions: paperData[0].researchQuestions, info: [], researchQuestionId: -1} });
    }

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: title => <div>{title}</div>
        },
        {
            title: 'Publication Year',
            dataIndex: 'publishDate',
            key: 'publishDate',
            render: publishDate => <div>{publishDate}</div>
        },
        // {
        //     title: 'Area',
        //     dataIndex: 'area',
        //     key: 'area',
        //     render: area => <div>{area}</div>
        // },
        // {
        //     title: 'Pdf Link',
        //     dataIndex: 'pdfLink',
        //     key: 'pdfLink',
        //     render: pdfLink => <div>{pdfLink}</div>
        // },
        {
            title: 'Publisher',
            dataIndex: 'publisher',
            key: 'publisher',
            render: publisher => <div>{publisher}</div>
        },
        {
            title: 'Weight',
            dataIndex: 'weight',
            key: 'weight',
            render: weight => <div>{weight}</div>
        },
        {
            title: 'Pick',
            key: 'pick',
            render: (text, paper) => (
                <div>
                    <input
                        type="checkbox"
                        // checked={paper.isPicked}
                        onClick={(event) => toggleCheckbox(paper.key)}
                    />
                    <br/><span>{paper.numberPicked}/{paper.numberParticipants}</span>
                </div>
            )
        },
        {
            title: 'Unpick',
            key: 'unpick',
            render: (text, paper) => (
                <div>
                    <input
                        type="checkbox"
                        // checked={paper.isUnPicked}
                        onClick={(event) => toggleCheckboxUnpick(paper.key)}
                    />
                    <br/><span>{paper.numberUnPicked}/{paper.numberParticipants}</span>
                </div>
            )
        },
        {
            title: 'Answer',
            key: 'answer',
            render: (text, paper) => (
                <button type="button" onClick={(event) => handleAnswer(paper)}>
                    Answer RQs
                </button>
            )
        },
        {
            title: 'Show Answers',
            key: 'showAnswers',
            render: (text, paper) => (
                <button type="button" onClick={(event) => handleShowAnswers(paper)}>
                    Show Answers
                </button>
            )
        },
    ];
    let paperData = msPapers.map(paper => {
        console.log("PPPPPPPPPPPPPPPPPPP: " + paper.picked);
        // console.log("UUUUUUUUUUUUUUUUUU: " + paper.isUnPicked);+
        return ({
            key: paper.id,
            title: paper.title,
            publishDate: paper.publishDate,
            area: paper.area,
            pdfLink: paper.pdfLink,
            publisher: paper.publisher,
            weight: paper.weight,
            researchQuestions: paper.researchQuestions,
            numberPicked : paper.numberPicked,
            numberUnPicked: paper.numberUnPicked,
            numberParticipants: paper.numberParticipants,
            isPicked: paper.picked,
            isUnPicked:paper.unPicked
        })
    });

    return (
        <div>
            <Select options={getOptions()} onChange={handleChange}/>
            <Button type="primary" htmlType="submit" onClick={handleSort}>
                Sort Consensus
            </Button>
            <Table columns={columns} dataSource={paperData}/>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    )
}

MSList.propTypes = {
    // msPapers: PropTypes.array.isRequired,
    // selectedCheck: PropTypes.func.isRequired
};

// export default MSList;

const WrappedGamePage = LayoutWrapper(MSList);
export default WrappedGamePage;
