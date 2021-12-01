import React, {Component, Fragment} from "react";
import PropTypes from 'prop-types';
// import '../App/App.css';
// import '../static/css/main.css';

import {
    Input,
    Select,
    Row,
    Col,
    Button,
    DatePicker,
} from 'antd';
import moment from "moment";
import {isEmpty, isNumber} from "../utils/utils";

const {Option} = Select;
const InputGroup = Input.Group;


export const msgType = Object.freeze({'SUCCESS': 'Success', 'ERROR': 'error'});

/**
 * Class component for displaying form, handling validation of input and triggering submission.
 */
export class MappingStudyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            dateOfCreation: "",
            area: "",
            researchQuestion:"",
            searchQuery: "",
            startDate: "",
            endDate: "",
            validation: {
                name: {
                    required: true,
                    error: ""
                },
                dateOfCreation: {
                    required: true,
                    error: ""
                },
                area: {
                    required: true,
                    error: ""
                },
                researchQuestion: {
                    required: true,
                    error: ""
                },
                searchQuery: {
                    required: true,
                    error: ""
                },
                startDate: {
                    required: true,
                    error: ""
                },
                endDate: {
                    required: true,
                    error: ""
                }
            },
        }
    }

    // This function is invoked during an update.
    // Set conditions so the update does not go on loop
    onUpdate(prevProps, prevState) {
        const {clearFlag, setClearFlag, selectedMS} = this.props;
        //checking whether to clear fields or not
        if ((clearFlag !== prevProps.clearFlag) &&
            clearFlag) {
            this.clearForm();
            setClearFlag(false);
        }

        if (!isEmpty(selectedMS) && (prevProps.selectedMS.key !== selectedMS.key)) {
            let {validation} = this.state;
            validation.name.error = "";
            validation.dateOfCreation.error = "";
            validation.area.error = "";
            validation.researchQuestion.error = "";
            validation.searchQuery.error = "";
            validation.startDate.error = "";
            validation.endDate.error = "";
            this.setState({
                name: selectedMS.name,
                dateOfCreation: selectedMS.dateOfCreation,
                area: selectedMS.area,
                researchQuestion: selectedMS.researchQuestion,
                searchQuery: selectedMS.searchQuery,
                startDate: selectedMS.startDate,
                endDate: selectedMS.endDate,
                validation: validation,
            })
        }
    }

    clearForm = () => {
        let {
            name, dateOfCreation, area, researchQuestion, searchQuery, startDate, endDate, validation
        } = this.state;
        name = "";
        dateOfCreation = "";
        area = "";
        researchQuestion="";
        searchQuery="";
        startDate="";
        endDate="";
        validation.name.error = "";
        validation.dateOfCreation.error = "";
        validation.area.error = "";
        validation.researchQuestion.error = "";
        validation.searchQuery.error = "";
        validation.startDate.error = "";
        validation.endDate.error = "";
        this.setState({
            name, dateOfCreation, area, researchQuestion, searchQuery, startDate, endDate, validation
        });
    };

    // checks if there are validation errors and then calls the create or update accordingly.
    onSubmit = e => {
        e.preventDefault();
        const {name, dateOfCreation, area, researchQuestion, searchQuery, startDate, endDate, validation} = this.state;
        const {selectedMS, createMS, updateMS} = this.props;
        if (!(validation.name.error || validation.dateOfCreation.error || validation.area.error || validation.researchQuestion.error
            || validation.searchQuery.error || validation.startDate.error || validation.endDate.error)) {
            if (isEmpty(selectedMS)) {
                createMS(
                    name, dateOfCreation, area, researchQuestion, searchQuery, startDate, endDate
                );
            } else {
                updateMS(
                    selectedMS.key, name, dateOfCreation, area, researchQuestion, searchQuery, startDate, endDate
                );
            }
        }
    };

    onNameChange = e => {
        this.setState({name: e.target.value});
    };

    onDateOfCreationChange = value => {
        this.setState({dateOfCreation: value});
    };

    onAreaChange = e => {
        this.setState({area: e.target.value});
    };

    onResearchQuestionChange = e => {
        this.setState({researchQuestion: e.target.value});
    };

    onSearchQueryChange = e => {
        this.setState({searchQuery: e.target.value});
    };
    onStartDateChange = value => {
        this.setState({startDate: value});
    };
    onEndDateChange = value => {
        this.setState({endDate: value});
    };

    validateName = () => {
        let {validation} = this.state;
        if (validation.name.required && this.state.name === "") {
            validation.name.error = "This field is required";
        } else {
            validation.name.error = "";
        }
        this.setState({validation: validation});
    };

    validateArea = () => {
        let {validation} = this.state;
        if (validation.area.required && this.state.type === "") {
            validation.area.error = "This field is required.";
        } else {
            validation.area.error = ""
        }
        this.setState({validation: validation});
    };

    validateResearchQuestion = () => {
        let {validation} = this.state;
        if (validation.researchQuestion.required && this.state.type === "") {
            validation.researchQuestion.error = "This field is required.";
        } else {
            validation.researchQuestion.error = ""
        }
        this.setState({validation: validation});
    };

    validateSearchQuery = () => {
        let {validation} = this.state;
        if (validation.searchQuery.required && this.state.type === "") {
            validation.searchQuery.error = "This field is required.";
        } else {
            validation.searchQuery.error = ""
        }
        this.setState({validation: validation});
    };

    disablePastDays = current => {
        return current && current <= moment().endOf('day');
    };

    render() {
        const {selectedMS, clearStatus} = this.props;

        return (
            <Fragment>
                <form>
                    <div className="form-row">
                        <Row type="flex" justify="start" align="middle">
                            <Col span={3}>
                                <label className="required-field">Name</label>
                            </Col>
                            <Col span={8}>
                                <Input
                                    value={this.state.name}
                                    onChange={this.onNameChange}
                                    onBlur={this.validateName}
                                    onClick={clearStatus}
                                />
                                {this.state.validation.name.error &&
                                <div className="input-error">{this.state.validation.name.error}</div>}
                            </Col>
                        </Row>
                    </div>
                    <div className="form-row">
                        <Row type="flex" justify="start">
                            <Col span={3}>
                                <label>Date of Creation</label>
                            </Col>
                            <div className={{"display": "flex"}} onClick={clearStatus}>
                                <DatePicker
                                    style={{"display": "flex"}}
                                    value={this.state.dateOfCreation ? moment(this.state.dateOfCreation) : null}
                                    onChange={this.onDateOfCreationChange}
                                    disabledDate={this.disablePastDays}
                                />
                            </div>
                        </Row>
                    </div>
                    <div className="form-row">
                        <Row type="flex" justify="start">
                            <Col span={3}>
                                <label className="required-field">Area</label>
                            </Col>
                            <Col span={8}>
                                <Input
                                    value={this.state.area}
                                    onChange={this.onAreaChange}
                                    onBlur={this.validateArea}
                                    onClick={clearStatus}
                                />
                                {this.state.validation.area.error &&
                                <div className="input-error">{this.state.validation.area.error}</div>}
                            </Col>
                        </Row>
                    </div>
                    <div className="form-row">
                        <Row type="flex" justify="start">
                            <Col span={3}>
                                <label className="required-field">Research Questions</label>
                            </Col>
                            <Col span={8}>
                                <Input
                                    value={this.state.researchQuestion}
                                    onChange={this.onResearchQuestionChange}
                                    onBlur={this.validateResearchQuestion}
                                    onClick={clearStatus}
                                />
                                {this.state.validation.researchQuestion.error &&
                                <div className="input-error">{this.state.validation.researchQuestion.error}</div>}
                            </Col>
                        </Row>
                    </div>
                    <div className="form-row">
                        <Row type="flex" justify="start">
                            <Col span={3}>
                                <label className="required-field">SearchQuery</label>
                            </Col>
                            <Col span={8}>
                                <Input
                                    value={this.state.searchQuery}
                                    onChange={this.onSearchQueryChange}
                                    onClick={clearStatus}
                                />
                                {this.state.validation.searchQuery.error &&
                                <div className="input-error">{this.state.validation.searchQuery.error}</div>}
                            </Col>
                        </Row>
                    </div>
                    <div className="form-row">
                        <Row type="flex" justify="start">
                            <Col span={3}>
                                <label>Start Date</label>
                            </Col>
                            <div className={{"display": "flex"}} onClick={clearStatus}>
                                <DatePicker
                                    style={{"display": "flex"}}
                                    value={this.state.startDate ? moment(this.state.startDate) : null}
                                    onChange={this.onStartDateChange}
                                    // disabledDate={this.disablePastDays}
                                />
                            </div>
                        </Row>
                    </div>
                    <div className="form-row">
                        <Row type="flex" justify="start">
                            <Col span={3}>
                                <label>End Date</label>
                            </Col>
                            <div className={{"display": "flex"}} onClick={clearStatus}>
                                <DatePicker
                                    style={{"display": "flex"}}
                                    value={this.state.endDate ? moment(this.state.endDate) : null}
                                    onChange={this.onEndDateChange}
                                    // disabledDate={this.disablePastDays}
                                />
                            </div>
                        </Row>
                    </div>
                    <Button type="primary" htmlType="submit" onClick={this.onSubmit}>
                        {isEmpty(selectedMS) ? "Create" : "Update"}
                    </Button>
                </form>
            </Fragment>
        );
    }
}

MappingStudyForm.propTypes = {
    createMS: PropTypes.func.isRequired,
    fetchMSInfo: PropTypes.func.isRequired,
    updateMS: PropTypes.func.isRequired,
    clearFlag: PropTypes.bool.isRequired,
    setClearFlag: PropTypes.func.isRequired,
    selectedMS: PropTypes.object.isRequired,
    clearStatus: PropTypes.func.isRequired
};

export default MappingStudyForm;
