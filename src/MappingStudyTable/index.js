import React from 'react';
import PropTypes from 'prop-types';

import {Divider, Table} from 'antd';
import {isEmpty} from "../utils/utils";
// import '../App/App.css';
// import '../static/css/main.css';

function MappingStudyTable(props) {
    const {MSInfo, setSelectedMS, deleteMS, listPapersMS, exportMS, shareMS} = props;
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: name => <div>{name}</div>
        },
        // {
        //     title: 'Date of Creation',
        //     dataIndex: 'dateOfCreation',
        //     key: 'dateOfCreation',
        //     render: dateOfCreation => <div>{isEmpty(dateOfCreation) ? "-" : dateOfCreation.substring(0, 10)}</div>
        // },
        // {
        //     title: 'Area',
        //     dataIndex: 'area',
        //     key: 'area',
        //     render: area => <div>{area}</div>
        // },
        {
            title: 'Research Questions',
            dataIndex: 'researchQuestion',
            key: 'researchQuestion',
            render: researchQuestion => <div>{researchQuestion.map(rs => rs.question)}</div>
        },
        // {
        //     title: 'Search Query',
        //     dataIndex: 'searchQuery',
        //     key: 'searchQuery',
        //     render: searchQuery => <div>{searchQuery}</div>
        // },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: startDate => <div>{isEmpty(startDate) ? "-" : startDate.substring(0, 10)}</div>
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: endDate => <div>{isEmpty(endDate) ? "-" : endDate.substring(0, 10)}</div>
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, ms) => (
                <span>
                    <a onClick={() => setSelectedMS(ms)}>Edit</a>
                    <Divider type="vertical"/>
                    <a onClick={() => deleteMS(ms.key)}>Delete</a>
                    <Divider type="vertical"/>
                    <a onClick={() => listPapersMS(ms.key)}>List</a>
                    <Divider type="vertical"/>
                    <a onClick={() => exportMS(ms.key)}>Export</a>
                    <Divider type="vertical"/>
                    <a onClick={() => shareMS(ms.key)}>Share</a>
                </span>
            )
        },
    ];
    const MSData = MSInfo.map(ms => {
        return ({
            key: ms.id,
            name: ms.name,
            // dateOfCreation: ms.dateOfCreation,
            // area: ms.area,
            researchQuestion: ms.researchQuestion,
            // searchQuery: ms.searchQuery,
            startDate: ms.startDate,
            endDate: ms.endDate,
        })
    });
    return (
        <Table columns={columns} dataSource={MSData}/>
    )
}

MappingStudyTable.propTypes = {
    MSInfo: PropTypes.array.isRequired,
    setSelectedMS: PropTypes.func.isRequired,
    deleteMS: PropTypes.func.isRequired,
    listPapersMS: PropTypes.func.isRequired,
    shareMS: PropTypes.func.isRequired
};

export default MappingStudyTable;
