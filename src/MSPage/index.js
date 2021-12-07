import React, {Fragment, useEffect, useState} from 'react';
import GameForm, {msgType} from "../MappingStudyForm";
import LayoutWrapper from "../LayoutWrapper";
import MappingStudyForm from "../MappingStudyForm";
import MappingStudyTable from "../MappingStudyTable";
import { useHistory } from "react-router-dom";
import dateformat from "dateformat";
import config from 'config';
import {Redirect} from "react-router-dom";
import MSList from "../MSList";
import {useSelector} from "react-redux";
// import '../App/App.css';
// import '../static/css/main.css';

export function MSPage() {

    const [MSInfo, setMSInfo] = useState([]);
    const [selectedMS, setSelectedMS] = useState({});
    const [statusMsgType, setStatusMsgType] = useState(msgType.SUCCESS);
    const [statusMsg, setStatusMsg] = useState("");
    const [clearFlag, setClearFlag] = useState(false);
    const history = useHistory();
    const user = useSelector(state => state.authentication.user);

    // const selectedCheck = new Set();

    const fetchMSInfo = async () => {
        console.log("USER: " + user.id);
        await fetch(`${config.apiUrl}/mappingStudies?userId=${user.id}`)
            .then(res => {
                if (res.ok){
                    return res.json();
                } else {
                    throw new Error("Error while fetching Mapping Study details");
                }
            })
            .then(data => {
                console.log(data);
                setMSInfo(data);
                setStatusMsgType(msgType.SUCCESS);
            })
            .catch(error => {
                setStatusMsgType(msgType.ERROR);
                setStatusMsg(error.toString());
            });
    };

    //Is equivalent to class component's componentDidMount,
    // componentDidUpdate and componentWillUnmount lifecycle
    // use of the second argument tells it to run only when it mounts
    // if something is provided in second argument then it
    // runs only when the provided value changes
    useEffect(() => {
        fetchMSInfo();
    }, []);

    //REST API call
    const createMS = (name, dateOfCreation, area, researchQuestion, searchQuery, startDate, endDate) => {

        console.log("USER ID" + user.id);
        let data = {
            method: 'POST',
            body: JSON.stringify({
                'userId': user.id,
                'name': name,
                'dateOfCreation': dateOfCreation,
                'area': area,
                'researchQuestions': researchQuestion,
                'query': searchQuery,
                'from': dateformat(startDate, "yyyy"),
                'to': dateformat(endDate, "yyyy"),
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        };

        console.log("DATA" + data);
        fetch(`${config.apiUrl}/mappingStudies`, data)
            .then(res => {
                if (res.ok) {
                 return res.json();
                }
                // else {
                //     throw new Error("EmailOfCreator must be unique.")
                // }
            })
            .then(data => {
                fetchMSInfo();
                setClearFlag(true);
                setStatusMsgType(msgType.SUCCESS);
                setStatusMsg("Saved successfully");
            })
            .catch(error => {
                setStatusMsgType(msgType.ERROR);
                console.log(error);
                setStatusMsg( error.toString());
            });
    };

    const updateMS = async (id, name, dateOfCreation, area, researchQuestion, searchQuery, startDate, endDate) => {
        let data = {
            method: 'PATCH',
            body: JSON.stringify({
                'userId': user.id,
                'id': id,
                'name': name,
                'dateOfCreation': dateOfCreation,
                'area': area,
                'researchQuestion': researchQuestion,
                'searchQuery': searchQuery,
                'startDate': startDate,
                'endDate': endDate,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        };
        fetch(`${config.apiUrl}/mappingStudies/${id}?userId=${user.id}`, data)
            .then(res => {
            if (res.ok) {
                return res.json();
            }
            // else {
            //     throw new Error("\"Email of Creator must be unique.\"");
            // }
            })
            .then(data => {
                fetchMSInfo();
                setClearFlag(true);
                setStatusMsgType(msgType.SUCCESS);
                setSelectedMS({});
                setStatusMsg("Updated successfully");
            })
            .catch(error => {
                setStatusMsgType(msgType.ERROR);
                setStatusMsg(error.toString());
            });
    };

    const exportMS = (id) => {
        // Call Amr API
        // See how to export in REACT
        window.open(`${config.apiUrl}/export?mappingStudyId=${id}&userId=${user.id}`);
        // fetch(`${config.apiUrl}/export?mappingStudyId=${id}&userId=${user.id}`)
        //     .then(res => {
        //         if (res.ok){
        //             return res.json();
        //         } else {
        //             throw new Error("Error while fetching Mapping Study details");
        //         }
        //     })
        //     .then(data => {
        //         console.log(data);
        //         // setMSInfo(data);
        //         // setStatusMsgType(msgType.SUCCESS);
        //     })
        //     .catch(error => {
        //         setStatusMsgType(msgType.ERROR);
        //         setStatusMsg(error.toString());
        //     });

    };

    const shareMS = (id) => {
        let fetchData = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        history.push({pathname: "/share", state: {mappingStudyId: id} });
    };


    const deleteMS = (id) => {
        let fetchData = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`${config.apiUrl}/mappingStudies/${id}?userId=${user.id}`, fetchData)
            .then(res => {
                if (res.ok) {
                fetchMSInfo();
                } else {
                    throw new Error("Error while deleting game.");
                }
            })
            .catch(error => {
                setStatusMsgType(msgType.ERROR);
                setStatusMsg(error.toString());
            });
    };

    // const handleFormSubmit = formSubmitEvent => {
    //     formSubmitEvent.preventDefault();
    //
    //     for (const checkbox of selectedCheck) {
    //         console.log(checkbox, 'is selected.');
    //     }
    //
    //     // Put call to Amr Endpoint sending selection
    //     // let data = {
    //     //     method: 'PUT',
    //     //     body: JSON.stringify({
    //     //         'selected'
    //     //     }),
    //     //     headers: {
    //     //         'Content-Type': 'application/json',
    //     //     }
    //     // };
    //     // fetch(APIUrls.MS, data)
    //     //     .then(res => {
    //     //         if (res.ok) {
    //     //             return res.json();
    //     //         }
    //     //         // else {
    //     //         //     throw new Error("\"Email of Creator must be unique.\"");
    //     //         // }
    //     //     })
    //     //     .then(data => {
    //     //         fetchMSInfo();
    //     //         setClearFlag(true);
    //     //         setStatusMsgType(msgType.SUCCESS);
    //     //         setSelectedMS({});
    //     //         setStatusMsg("Updated successfully");
    //     //     })
    //     //     .catch(error => {
    //     //         setStatusMsgType(msgType.ERROR);
    //     //         setStatusMsg(error.toString());
    //     //     });
    // }

    const listPapersMS = (id) => {
        let fetchData = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        console.log("ID OF THE MS: " + id);
        fetch(`${config.apiUrl}/mappingStudies/${id}/articles?userId=${user.id}`, fetchData)
            .then(res => {
                if (res.ok) {
                    //Do something
                    return res.json();
                    //fetchMSInfo();
                } else {
                    throw new Error("Error while trying to list articles game.");
                }
            })
            .then(data => {
                // setMSInfo(data);
                setStatusMsgType(msgType.SUCCESS);
                console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                console.log(data);
                //return <Redirect to={{ pathname: '/list', state: { msPapers: data, selectedCheck: selectedCheck } }} />
                history.push({pathname: "/list", state: {msPapers: data, mappingStudyId: id, selectedCheckParameter: new Set(), unselectedCheckParameter: new Set() } });
                //return <MSList msPapers={data}/>;
            })
            .catch(error => {
                setStatusMsgType(msgType.ERROR);
                setStatusMsg(error.toString());
            });
    };

    const clearStatus = () => {
        setStatusMsgType(msgType.SUCCESS);
        setStatusMsg("");
    };

    const statusClassName = statusMsgType === msgType.ERROR?'error-status': 'success-status';

    //Fragment allows to group a list of children without adding extra nodes to the DOM
    return (
        <Fragment>
            <MappingStudyForm
                createMS={createMS}
                fetchMSInfo={fetchMSInfo}
                updateMS={updateMS}
                clearFlag={clearFlag}
                setClearFlag={setClearFlag}
                selectedMS={selectedMS}
                clearStatus={clearStatus}
            />
            {statusMsg && <div className={statusClassName}>{statusMsg}</div>}
            <MappingStudyTable
                MSInfo={MSInfo}
                setSelectedMS={setSelectedMS}
                deleteMS={deleteMS}
                listPapersMS={listPapersMS}
                exportMS={exportMS}
                shareMS={shareMS}
            />
        </Fragment>
    )
}

const WrappedGamePage = LayoutWrapper(MSPage);
export default WrappedGamePage;
