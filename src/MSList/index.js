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
import Loader from "react-loader-spinner";
// import '../App/App.css';
// import '../static/css/main.css';


function MSList(props) {
    // const {msPapers, selectedCheck} = props;
    const user = useSelector(state => state.authentication.user);
    let msPapers = props.history.location.state?.msPapers
    let selectedCheckParameter = props.history.location.state?.selectedCheckParameter
    let unselectedCheckParameter = props.history.location.state?.unselectedCheckParameter
    const mappingStudyId = props.history.location.state?.mappingStudyId

    let selectedCheck = selectedCheckParameter;
    let unselectedChecks = new Set();
    // let selectedCheck = new Set();
    // let unselectedChecks = new Set();
    let selectedUnPick = unselectedCheckParameter;
    let unselectedUnPick = new Set();

    for(const temp of msPapers){
        // console.log("Processing: ", temp);
        unselectedChecks.add(temp.id);
        unselectedUnPick.add(temp.id);
    }

    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const toggleCheckbox = (paper, key) => {
        console.log("Storing paper: " + key);
        console.log("Selected: ", selectedCheck);
        console.log("Not Selected: ", unselectedChecks);

        if(paper.isPicked){
            //history.push({pathname: "/list", state: {msPapers: msPapers, mappingStudyId: mappingStudyId , selectedCheckParameter: selectedCheck, unselectedCheckParameter: selectedUnPick} });
        }

        else{
            if (!selectedCheck.has(key)) {
                unselectedChecks.delete(key)
                selectedCheck.add(key);
            } else {
                unselectedChecks.add(key);
                selectedCheck.delete(key);
            }

            history.push({pathname: "/list", state: {msPapers: msPapers, mappingStudyId: mappingStudyId , selectedCheckParameter: selectedCheck, unselectedCheckParameter: selectedUnPick} });
        }


    }

    const toggleCheckboxUnpick = (paper, key) => {
        console.log("Storing paper: " + key);
        console.log("Selected: ", selectedUnPick);
        console.log("Not Selected: ", unselectedUnPick);

        if(paper.isUnPicked){
            //history.push({pathname: "/list", state: {msPapers: msPapers, mappingStudyId: mappingStudyId , selectedCheckParameter: selectedCheck, unselectedCheckParameter: selectedUnPick} });
            return;
        }

        else{
            if (!selectedUnPick.has(key)) {
                unselectedUnPick.delete(key)
                selectedUnPick.add(key);
            } else {
                unselectedUnPick.add(key);
                selectedUnPick.delete(key);
            }

            history.push({pathname: "/list", state: {msPapers: msPapers, mappingStudyId: mappingStudyId , selectedCheckParameter: selectedCheck, unselectedCheckParameter: selectedUnPick} });
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
        let options = rqs.map(rq => ({
            "value" : rq.id,
            "label" : rq.question
        }))

        console.log(options);
        return options;
    }

    const handleChange = async (e) => {
        console.log("CHANGEEEEEEE");
        console.log(e);

        setLoading((loading) => !loading);
        await fetch(`${config.apiUrl}/mappingStudies/${mappingStudyId}/researchQuestionsWeights/${e.value}?userId=${user.id}`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                // else {
                //     throw new Error("EmailOfCreator must be unique.")
                // }
            })
            .then(data => {
                setLoading((loading) => !loading);
                console.log("URL" + `${config.apiUrl}/mappingStudies/${mappingStudyId}/researchQuestionsWeights/${e.value}?userId=${user.id}`);
                console.log("RECEIVING WEIGHTS!!!")
                console.log(msPapers[0].weight)
                history.push({pathname: "/list",
                    state: {
                        msPapers: data,
                        mappingStudyId: mappingStudyId,
                        selectedCheckParameter: selectedCheck,
                        unselectedCheckParameter: selectedUnPick
                    }
                });
            })
            .catch(error => {
                setLoading((loading) => !loading);
                console.log(error);
            });
    }

    const handleSubmit = () => {
        console.log("Submit Selection");
        console.log(selectedCheck);

        // for(const temp of msPapers){
        //     // console.log("Processing: ", temp);
        //     unselectedChecks.add(temp.id);
        //     unselectedUnPick.add(temp.id);
        // }
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
                history.push({pathname: "/list", state: {msPapers: data, mappingStudyId: mappingStudyId , selectedCheckParameter: new Set(), unselectedCheckParameter: new Set()} });
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
                history.push({pathname: "/list", state: {msPapers: data, mappingStudyId: mappingStudyId , selectedCheckParameter: selectedCheck, unselectedCheckParameter: selectedUnPick} });
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleSortOverall = () => {
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
        fetch(`${config.apiUrl}/mappingStudies/${mappingStudyId}/articles?userId=${user.id}`, data)
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
                history.push({pathname: "/list", state: {msPapers: data, mappingStudyId: mappingStudyId , selectedCheckParameter: selectedCheck, unselectedCheckParameter: selectedUnPick} });
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleCluster = () => {
        console.log("SORTING BY CLUSTER");
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
        fetch(`${config.apiUrl}/mappingStudies/${mappingStudyId}/articles/clusters?userId=${user.id}`, data)
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
                history.push({pathname: "/list", state: {msPapers: data, mappingStudyId: mappingStudyId , selectedCheckParameter: selectedCheck, unselectedCheckParameter: selectedUnPick} });
            })
            .catch(error => {
                console.log(error);
            });
    }


    const handleAnswer = (paper) => {
        console.log("Handle Answer");
        history.push({pathname: "/answers", state: {msPapers: msPapers, paper: paper, mappingStudyId: mappingStudyId, researchQuestions: paperData[0].researchQuestions, selectedCheckParameter: selectedCheck, unselectedCheckParameter: selectedUnPick} });
    }

    const handleShowAnswers = (paper) => {
        console.log("Handle Show Answer");
        // let answers = {};
        // paperData[0].researchQuestions.map(rq => answers[rq.id] = {});
        console.log("MSPapers: " + msPapers);
        history.push({pathname: "/showAnswers", state: {msPapers: msPapers, paper: paper, mappingStudyId: mappingStudyId, researchQuestions: paperData[0].researchQuestions, info: [], researchQuestionId: -1, selectedCheckParameter: selectedCheck, unselectedCheckParameter: selectedUnPick} });
    }

    const handlePaperWithAnswers = () => {
        console.log("Get Papers with answers");

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
        fetch(`${config.apiUrl}/mappingStudies/${mappingStudyId}/articlesWithAnswers?userId=${user.id}`, data)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                // else {
                //     throw new Error("EmailOfCreator must be unique.")
                // }
            })
            .then(data => {
                console.log("Successful Obtain answers")
                if(data == false){
                    //Show message that the selection failed
                }
                history.push({pathname: "/list", state: {msPapers: data, mappingStudyId: mappingStudyId , selectedCheckParameter: selectedCheck, unselectedCheckParameter: selectedUnPick} });
            })
            .catch(error => {
                console.log(error);
            });
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
            title: 'Cluster',
            dataIndex: 'cluster',
            key: 'cluster',
            render: cluster => <div>{cluster}</div>
        },
        {
            title: 'Pick',
            key: 'pick',
            render: (text, paper) => (
                <div>
                    <input
                        type="checkbox"
                        checked={selectedCheck.has(paper.key) || paper.isPicked}
                        onChange={(event) => toggleCheckbox(paper, paper.key)}
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
                        checked={selectedUnPick.has(paper.key) || paper.isUnPicked}
                        onChange={(event) => toggleCheckboxUnpick(paper, paper.key)}
                    />
                    <br/><span>{paper.numberUnPicked}/{paper.numberParticipants}</span>
                </div>
            )
        },
        {
            title: 'Answer',
            key: 'answer',
            render: (text, paper) => (
                // <button type="button" onClick={(event) => handleAnswer(paper)}>
                //     Answer RQs
                // </button>
                <Button type="primary" htmlType="submit" onClick={(event) => handleAnswer(paper)}>
                    Answer RQs
                </Button>
            )
        },
        {
            title: 'Show Answers',
            key: 'showAnswers',
            render: (text, paper) => (
                // <button type="button" onClick={(event) => handleShowAnswers(paper)}>
                //     Show Answers
                // </button>
                <Button type="primary" htmlType="submit" onClick={(event) => handleShowAnswers(paper)}>
                    Show Answers
                </Button>
            )
        },
    ];
    let paperData = msPapers.map(paper => {
        console.log("PPPPPPPPPPPPPPPPPPP: " + paper.picked);
        console.log("CLUSTER: " + paper.clusterId);
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
            isUnPicked:paper.unPicked,
            cluster: paper.clusterId
        })
    });

    return (
        <div>
            <Button type="primary" htmlType="submit" onClick={handleSortOverall}>
                Sort by Overall
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit" onClick={handleSort}>
                Sort Consensus
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit" onClick={handleCluster}>
                Sort by Clusters
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit" onClick={handlePaperWithAnswers}>
                Get Article With Answers
            </Button>
            <Select options={getOptions()} onChange={handleChange}/>
            {loading ? <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" /> :
            <Table columns={columns} dataSource={paperData}/>}
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
