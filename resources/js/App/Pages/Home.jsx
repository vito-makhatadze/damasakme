import React, {useEffect, useState} from 'react'
import Loading from "../Components/Loading/Loading";
import {Accordion, Button, Form, Modal, useAccordionButton} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useForm, usePage} from "@inertiajs/inertia-react";
import toast, {Toaster} from 'react-hot-toast'

function CustomToggle({children, eventKey}) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('totally custom!'),
    );

    return (
        <div
            onClick={decoratedOnClick}
        >
            {children}
        </div>
    );
}

export default function Index(props) {
    const {cities, jobs, degrees} = props;
    const [loading, setLoading] = useState(true)
    const [step, setStep] = useState(1)
    const [validatedOne, setValidatedOne] = useState(false);
    const [validatedTwo, setValidatedTwo] = useState(false);
    const [validatedTree, setValidatedTree] = useState(false);
    const [showMenu, setShowMenu] = useState(false)
    const {social} = usePage().props;
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const [defaultActiveKey,setDefaultActiveKey] = useState([
        'acc-0',
        'acc-1',
        'acc-2',
        'acc-3',
        'acc-4',
        'acc-5',
        'acc-6',
        'acc-7',
        'acc-8',
        'acc-9',
        'acc-10',
        'acc-11',
    ]);

    const [removeDegreeIndex, setRemoveDegreeIndex] = useState(-1)

    const [selectedDegrees, setSelectedDegrees] = useState([]);
    const [fileInput, setFileInput] = useState('')

    const [submiting, setSubmiting] = useState(false)

    const {data, setData, post, reset, errors} = useForm({
        first_name: '',
        last_name: '',
        birthday: '',
        email: '',
        gender: '',
        mobile: '',
        address: '',
        file: null,
        city: cities && cities.length ? cities[0].id : null,
        city_area: null,
        city_area_district: null,
        jobs: [],
        degrees: [],
        term: false
    });

    const onChange = (e) => setData({...data, [e.target.id]: e.target.value});
    const onSelectChange = (e) => e.target.value ? setData({...data, [e.target.id]: e.target.value}) : null

    const changeDegree = (e, index) => {
        let degrees = data.degrees
        degrees[index] = {
            ...degrees[index],
            [e.target.id]: e.target.value
        }
        setData({
            ...data,
            degrees: degrees
        })
    };

    const removeDegree = () => {
        if (removeDegreeIndex >= 0) {
            setData({
                ...data,
                degrees: data.degrees.filter(function (degree, key) {
                    return key !== removeDegreeIndex
                })
            })
            let newSelectedDegrees = selectedDegrees.filter((el) => el !== removeDegreeIndex)
            setSelectedDegrees(newSelectedDegrees)
            setRemoveDegreeIndex(-1)
        }
    }

    const onCityChange = (e) => {
        setData({
            ...data,
            city: e.target.value,
            city_area: null,
            city_area_district: null
        })

        let city = cities.find((el) => el.id == e.target.value)
        setSelectedCity(city ?? null)
        setSelectedArea(null)
    };

    const onAreaChange = (e) => {
        if (!e.target.value) {
            return;
        }
        setData({
            ...data,
            city_area: e.target.value,
            city_area_district: null
        })

        let area = selectedCity.get_city_areas.find((el) => el.id == e.target.value)
        setSelectedArea(area ?? null)
    };
    const onDegreeChange = (e) => {
        const degree = degrees.find((el) => el.id == e.target.value)
        if (!degree) {
            return
        }
        let insertDegree
        if (degree.type) {
            insertDegree = {
                id: degree.id,
                type: degree.type,
                school: '',
                profession: '',
                start_date: '',
                end_date: '',
                title: degree.title
            }
        } else {
            insertDegree = {
                id: degree.id,
                type: degree.type,
                title: degree.title
            }
        }
        let newDegrees = [...data.degrees, insertDegree]
        setData({
            ...data,
            degrees: newDegrees
        })
        setSelectedDegrees(newDegrees.map(e => e.id));
    };

    useEffect(() => {

        setLoading(false)
    }, []);

    const handleBrowseClick = () => {
        const fileInput = document.getElementById("browse");
        fileInput.click();
    }

    const handleChange = (event) => {
        setData({
            ...data,
            file: event.target.files[0]
        })

        const fileInput = document.getElementById("browse");
        setFileInput(fileInput.value)
    }

    const increaseStepOne = () => {
        const form = document.querySelector('.step-one');
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            setStep(step + 1)
        }

        setValidatedOne(true);
    }
    const increaseStepTwo = () => {
        const form = document.querySelector('.step-two');
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            setStep(step + 1)
        }

        setValidatedTwo(true);
    }

    const submitForm = () => {
        const form = document.querySelector('.step-two');
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            setSubmiting(true)
            post(route('app.store'), {
                data,
                onSuccess: () => {
                    setSubmiting(false)
                    reset()
                    close()
                    setValidatedTwo(false);
                    setValidatedOne(false);
                    setValidatedTree(false)
                    setStep(1)
                    toast['success'](__('თქვენი განცხადება მიღებულია , გმადლობთ!'))
                },
            });
            setSubmiting(false)
        }

        setValidatedTwo(true);
    }

    const customValidation = (element) => {
        if (validatedTwo && element.type == 1 && (element.school == '' || element.profession == '' ||element.start_date == '' || element.end_date == '')) {
            return "error-header"
        }
        return "";
    }

    const handleCheck = (event) => {
        let updatedList = [...data.jobs];
        if (event.target.checked) {
            updatedList = [...data.jobs, event.target.value];
        } else {
            updatedList.splice(checked.indexOf(event.target.value), 1);
        }
        setData({
            ...data,
            jobs: updatedList
        });
    };

    return (
        <>
            <Toaster position='top-center' duration='6000'/>

            {loading ? (
                <Loading/>
            ) : (
                <>
                    <div className="container-fluid">
                        <div className="row row-height">
                            <div className="col-xl-4 col-lg-4 content-left">
                                <div className="content-left-wrapper">
                                    <div id="social">
                                        <ul>
                                            <li><a href={social.facebook} target="_blank"><i
                                                className="fab fa-facebook-f"></i></a></li>
                                            <li><a href={social.instagram} target="_blank"><i
                                                className="fab fa-instagram"></i></a></li>
                                            <li><a href={social.linkedin} target="_blank"><i
                                                className="fab fa-linkedin-in"></i></a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <figure><img src="/images/logoooooooooo.jpg" alt="" className="img-fluid"
                                                     width="270" height="270"/>
                                        </figure>
                                        <h2>{__('We_are_Hiring')}</h2>
                                        <p>
                                            {__('Tation_argumentum')}
                                        </p>
                                    </div>
                                    <div className="copy">{__('all_right_reserved')}</div>
                                </div>
                            </div>
                            <div className="col-xl-8 col-lg-8 content-right" id="start">
                                <div id="wizard_container">
                                    <div id="top-wizard">
                                        <span id="location"> {__('Filled')} {step - 1} {__('Page')}</span>
                                        <div id="progressbar"
                                             className="ui-progressbar ui-widget ui-widget-content ui-corner-all"
                                             role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                             aria-valuenow="100">
                                            <div
                                                style={{"width": `${((step - 1) / 2) * 100}%`}}
                                                className="ui-progressbar-value ui-widget-header ui-corner-left ui-corner-right"></div>
                                        </div>
                                    </div>
                                    <Form id="wrapped" method="post"
                                          encType="multipart/form-data" className="form">
                                        <input id="website" name="website" type="text" value=""/>
                                        <div id="middle-wizard">
                                            {
                                                step === 1 ? (
                                                    <Form noValidate validated={validatedOne} className="step-one"
                                                          id="step-1">
                                                        <h2 className="section_title">{__('Presentation')}</h2>
                                                        <div className="row">
                                                            <div className="col-md-6 col-sm-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="name">{__('FirstName')}</label>
                                                                    <input
                                                                        type="text"
                                                                        id="first_name"
                                                                        required
                                                                        className="form-control"
                                                                        name="first_name"
                                                                        value={data.first_name}
                                                                        onChange={onChange}
                                                                    />
                                                                    <div className="invalid-feedback">
                                                                        {__('Please_input_first_name')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 col-sm-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="lastname">{__('LastName')}</label>
                                                                    <input type="text"
                                                                           id="last_name"
                                                                           required
                                                                           className="form-control"
                                                                           name="last_name"
                                                                           value={data.last_name}
                                                                           onChange={onChange}
                                                                    />
                                                                    <div className="invalid-feedback">
                                                                        {__('Please_input_last_name')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-md-6 col-sm-6">
                                                                <div className="form-group">
                                                                    <label>{__('Sex')}</label>
                                                                    <div className="form-group radio_input">
                                                                        <input
                                                                            type="radio"
                                                                            name="gender"
                                                                            required
                                                                            className="none"
                                                                            value={data.gender}
                                                                        />
                                                                        <label
                                                                            className="container_radio mr-3">{__('Male')}
                                                                            <input
                                                                                type="radio"
                                                                                name="gender"
                                                                                value={data.gender}
                                                                                checked={data.gender === "Male"}
                                                                                onClick={() => setData({
                                                                                    ...data,
                                                                                    gender: 'Male'
                                                                                })}
                                                                                className="required"
                                                                            />
                                                                            <span className="checkmark"/>
                                                                        </label>
                                                                        <label
                                                                            className="container_radio">{__('Female')}
                                                                            <input
                                                                                type="radio"
                                                                                name="gender"
                                                                                value={data.gender}
                                                                                checked={data.gender === "Female"}
                                                                                onClick={() => setData({
                                                                                    ...data,
                                                                                    gender: 'Female'
                                                                                })}
                                                                                className="required"
                                                                            />
                                                                            <span className="checkmark"></span>
                                                                        </label>
                                                                        <div className="invalid-feedback">
                                                                            {__('Please_input_gender')}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 col-sm-6">
                                                                <div className="form-group">
                                                                    <label
                                                                        htmlFor="name_contact">{__('Birthday')}</label>
                                                                    <input
                                                                        type="date"
                                                                        className="form-control"
                                                                        required
                                                                        id="birthday"
                                                                        name="birthday"
                                                                        value={data.birthday}
                                                                        onChange={onChange}
                                                                    />
                                                                    <div className="invalid-feedback">
                                                                        {__('Please_input_birthday')}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12 col-sm-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="mail">{__('Email')}</label>
                                                                    <input
                                                                        type="email"
                                                                        id="email"
                                                                        className="form-control"
                                                                        name="email"
                                                                        value={data.email}
                                                                        required
                                                                        onChange={onChange}
                                                                    />
                                                                    <div className="invalid-feedback">
                                                                        {__('Please_input_correct_email')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12 col-sm-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="mail">{__('Mobile')}</label>
                                                                    <input
                                                                        type="text"
                                                                        pattern="[0-9][0-9][0-9]{7}"
                                                                        id="mobile"
                                                                        className="form-control"
                                                                        name="mobile"
                                                                        value={data.mobile}
                                                                        required
                                                                        onChange={onChange}
                                                                    />
                                                                    <div className="invalid-feedback">
                                                                        {__('Please_input_mobile')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12 col-sm-6">
                                                                <div className="form-group add_bottom_30 add_top_20">
                                                                    <label>{__('Upload_a_resume')}</label>
                                                                    <div className="fileupload d-flex">
                                                                        <input type="button" className="col-md-4"
                                                                               value={__('Select_the_file')}
                                                                               id="fakeBrowse"
                                                                               onClick={handleBrowseClick}/>
                                                                        <input type="text"
                                                                               value={fileInput}
                                                                               className="col-md-8 form-control"
                                                                               id="filename" readOnly="true" disabled/>
                                                                    </div>
                                                                    <input
                                                                        type="file"
                                                                        id="browse"
                                                                        name="file"
                                                                        required={!data.file}
                                                                        className={'none'}
                                                                        accept=".pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                                        onChange={handleChange}/>

                                                                    <div className="invalid-feedback">
                                                                        {__('Please_input_your_resume')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="text-center">
                                                                <div className="form-group terms">
                                                                    <label
                                                                        className="container_check">{__('Please_read_on')}
                                                                        <a href="#openModal-about"
                                                                           className={'conditions'}> {__('Terms_and_Conditions')}
                                                                        </a> {__('Before_submitting_the_application')}
                                                                        <input type="checkbox" name="terms"
                                                                               onChange={() => setData({
                                                                                   ...data,
                                                                                   term: !data.term
                                                                               })}
                                                                               className="required"
                                                                               required/>
                                                                        <span className="checkmark"></span>
                                                                    </label>
                                                                </div>
                                                                {
                                                                    !data.term ? (
                                                                        <div className="invalid-terms">
                                                                            {__('Please_check_terms')}
                                                                        </div>
                                                                    ): null
                                                                }
                                                            </div>
                                                        </div>
                                                    </Form>
                                                ) : null
                                            }
                                            {
                                                step === 2 ? (
                                                    <Form noValidate validated={validatedTwo} className="step step-two"
                                                          id="step-2">
                                                        <div className="row">
                                                            <div className="col-md-6 col-sm-6">
                                                                <div className="form-group">
                                                                    <Form.Label
                                                                        htmlFor="basic-url">{__('City')}</Form.Label>
                                                                    <Form.Select required
                                                                                 placeholder={__('select_a_city')}
                                                                                 value={data.city}
                                                                                 id="city"
                                                                                 onChange={onCityChange}
                                                                                 aria-label="Select a city">
                                                                        {
                                                                            cities.map((option, index) => {
                                                                                return (<option key={index}
                                                                                                value={option.id}>{option.title}</option>)
                                                                            })
                                                                        }
                                                                    </Form.Select>
                                                                    <div className="invalid-feedback">
                                                                        {__('Please_select_city')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {
                                                                data.city && selectedCity && selectedCity.get_city_areas.length ? (
                                                                    <div className="col-md-6 col-sm-6">
                                                                        <div className="form-group">
                                                                            <Form.Label
                                                                                htmlFor="basic-url">{__('Area')}</Form.Label>
                                                                            <Form.Select
                                                                                required
                                                                                value={data.city_area}
                                                                                id="city_area"
                                                                                onChange={onAreaChange}
                                                                                aria-label="select_a_area">
                                                                                <option value="" className="text-secondary">{__('Choose_area')}</option>
                                                                                {
                                                                                    selectedCity.get_city_areas.map((option, index) => {
                                                                                        return (<option
                                                                                            key={`${index}-${option.id}`}
                                                                                            value={option.id}>{option.title}</option>)
                                                                                    })
                                                                                }
                                                                            </Form.Select>
                                                                            <div className="invalid-feedback">
                                                                                {__('Please_select_area')}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : null
                                                            }
                                                            {
                                                                data.city_area && selectedArea && selectedArea.get_city_area_districts.length ? (
                                                                    <div className="col-md-6 col-sm-6">
                                                                        <div className="form-group">
                                                                            <Form.Label
                                                                                htmlFor="basic-url">{__('District')}</Form.Label>
                                                                            <Form.Select
                                                                                required value={data.city_area_district}
                                                                                id="city_area_district"
                                                                                onChange={onSelectChange}
                                                                                aria-label="Select_a_district">
                                                                                <option value="" className="text-secondary">{__('Choose_district')}</option>
                                                                                {
                                                                                    selectedArea.get_city_area_districts.map((option, index) => {
                                                                                        return (<option
                                                                                            key={`${index}-${option.id}`}
                                                                                            value={option.id}>{option.title}</option>)
                                                                                    })
                                                                                }
                                                                            </Form.Select>
                                                                            <div className="invalid-feedback">
                                                                                {__('please_select_district')}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : null
                                                            }
                                                            <div className="col-md-6 col-sm-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="name">{__('Address')}</label>
                                                                    <input type="text" id="address"
                                                                           value={data.address}
                                                                           className="form-control" required
                                                                           onChange={onChange} name="address"/>
                                                                    <div className="invalid-feedback">
                                                                        {__('Please_select_address')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12 col-sm-6">
                                                                <div className="form-group">
                                                                    <Form.Label
                                                                        htmlFor="basic-url">{__('Degree')}</Form.Label>
                                                                    <Form.Select
                                                                        id="city_area"
                                                                        onChange={onDegreeChange}
                                                                        value=""
                                                                        aria-label="Select a area">
                                                                        <option className="text-secondary">{__('Add_Degree')}</option>
                                                                        {
                                                                            degrees
                                                                                .map((option, index) => {
                                                                                    return (<option
                                                                                        key={`${index}-${option.id}`}
                                                                                        value={option.id}>{option.title}</option>)
                                                                                })
                                                                        }
                                                                    </Form.Select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <>
                                                            <Modal show={removeDegreeIndex >= 0} onHide={() => setRemoveDegreeIndex(-1)}>
                                                                <Modal.Header closeButton>
                                                                    <Modal.Title>
                                                                        {__('Remove_degree')}
                                                                    </Modal.Title>
                                                                </Modal.Header>
                                                                <Modal.Body>
                                                                    {__('Are_you_sure?')}
                                                                </Modal.Body>
                                                                <Modal.Footer>
                                                                    <Button variant="secondary" onClick={() => setRemoveDegreeIndex(-1)}>
                                                                        {__('No_delete')}
                                                                    </Button>
                                                                    <Button variant="danger" onClick={() => removeDegree()}>
                                                                        {__('Yes_delete')}
                                                                    </Button>
                                                                </Modal.Footer>
                                                            </Modal>
                                                        </>

                                                        <div className="row my-4">
                                                            <div className="col-md-12">
                                                                <Accordion
                                                                    defaultActiveKey={defaultActiveKey}
                                                                    alwaysOpen
                                                                >
                                                                    {
                                                                        data.degrees.map((el, index) => {
                                                                            return (
                                                                                <Accordion.Item
                                                                                    eventKey={`acc-${index}`}>
                                                                                    <div className="job-header">
                                                                                        <Accordion.Header className={customValidation(el)}>
                                                                                            <span>
                                                                                                {el.title}
                                                                                            </span>
                                                                                        </Accordion.Header>
                                                                                        <span
                                                                                            className="job-remove-icon"
                                                                                            onClick={() =>  setRemoveDegreeIndex(index)}
                                                                                        >
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                width="16" height="16"
                                                                                                fill="currentColor"
                                                                                                className="bi bi-trash"
                                                                                                viewBox="0 0 16 16">
                                                                                              <path
                                                                                                  d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                                                              <path fill-rule="evenodd"
                                                                                                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                                                            </svg>
                                                                                        </span>
                                                                                    </div>
                                                                                    {
                                                                                        el.type == 1 ? (
                                                                                            <Accordion.Body
                                                                                                className={'job-accordion-body' + el.type}>
                                                                                                <div
                                                                                                    className={'row py-5'}>
                                                                                                    <div
                                                                                                        className="col-md-12 col-sm-12">
                                                                                                        <div
                                                                                                            className="form-group">
                                                                                                            <label
                                                                                                                htmlFor="name">{__('School')}</label>
                                                                                                            <input
                                                                                                                type="text"
                                                                                                                id="school"
                                                                                                                required
                                                                                                                className="form-control"
                                                                                                                name="school"
                                                                                                                value={data.degrees[index].school}
                                                                                                                onChange={(e) => changeDegree(e, index)}
                                                                                                            />
                                                                                                            <div
                                                                                                                className="invalid-feedback">
                                                                                                                {__('Please_input_school')}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="col-md-12 col-sm-12">
                                                                                                        <div
                                                                                                            className="form-group">
                                                                                                            <label
                                                                                                                htmlFor="name">{__('Profession')}</label>
                                                                                                            <input
                                                                                                                type="text"
                                                                                                                id="profession"
                                                                                                                required
                                                                                                                className="form-control"
                                                                                                                name="profession"
                                                                                                                value={data.degrees[index].profession}
                                                                                                                onChange={(e) => changeDegree(e, index)}
                                                                                                            />
                                                                                                            <div
                                                                                                                className="invalid-feedback">
                                                                                                                {__('Please_input_proffesion')}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="col-md-6 col-sm-6">
                                                                                                        <div
                                                                                                            className="form-group">
                                                                                                            <label
                                                                                                                htmlFor="name_contact">{__('Start_Date')}</label>
                                                                                                            <input
                                                                                                                type="date"
                                                                                                                className="form-control"
                                                                                                                required
                                                                                                                id="start_date"
                                                                                                                name="start_date"
                                                                                                                value={data.degrees[index].start_date}
                                                                                                                onChange={(e) => changeDegree(e, index)}
                                                                                                            />
                                                                                                            <div
                                                                                                                className="invalid-feedback">
                                                                                                                {__('Please_input_start_date')}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="col-md-6 col-sm-6">
                                                                                                        <div
                                                                                                            className="form-group">
                                                                                                            <label
                                                                                                                htmlFor="name_contact">{__('End_Date')}</label>
                                                                                                            <input
                                                                                                                type="date"
                                                                                                                className="form-control"
                                                                                                                required
                                                                                                                id="end_date"
                                                                                                                name="end_date"
                                                                                                                value={data.degrees[index].end_date}
                                                                                                                onChange={(e) => changeDegree(e, index)}
                                                                                                            />
                                                                                                            <div
                                                                                                                className="invalid-feedback">
                                                                                                                {__('Please_input_end_date')}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </Accordion.Body>
                                                                                        ) : null
                                                                                    }
                                                                                </Accordion.Item>
                                                                            )
                                                                        })
                                                                    }
                                                                </Accordion>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-md-12 col-sm-6">
                                                                <Accordion flush>
                                                                    <Accordion.Item eventKey="0">
                                                                        <CustomToggle eventKey="0">
                                                                            <div
                                                                                className="col-md-12 btn job-expanded">
                                                                                {__('Desired_field_of_employment')}
                                                                            </div>
                                                                        </CustomToggle>
                                                                        <Accordion.Body
                                                                            className={'job-accordion-body'}>
                                                                            <div id="jobbox" className="p-2 row none">
                                                                                {
                                                                                    jobs.map((option, index) => {
                                                                                        return (
                                                                                            <div key={index}
                                                                                                 className="col-md-6">
                                                                                                <label
                                                                                                    className={'job-label'}>

                                                                                                    <input
                                                                                                        type="checkbox"
                                                                                                        checked={data.jobs.indexOf(`${option.id}`) > -1 ? 'checked': ''}
                                                                                                        onChange={handleCheck}
                                                                                                        value={option.id}/>
                                                                                                    {option.title}
                                                                                                </label>
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                    <div className="form-group">
                                                                        <input type="text"
                                                                               value={data.jobs.length ? 2 : null}
                                                                               className="form-control none-important"
                                                                               required
                                                                        />
                                                                        <div className="invalid-feedback">
                                                                            {__('Please_check_desired_field')}
                                                                        </div>
                                                                    </div>
                                                                </Accordion>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                ) : null
                                            }
                                        </div>
                                        <div id="bottom-wizard">
                                            {step > 1 ? (
                                                <button type="button" onClick={() => setStep(step - 1)} name="backward"
                                                        id="prev" className="backward">
                                                    {__('Prev')}
                                                </button>
                                            ) : null
                                            }
                                            {step == 1 ? (
                                                <button onClick={step === 1 ? increaseStepOne : increaseStepTwo}
                                                        type="button"
                                                        id="submit"
                                                        className="submit">
                                                    {__('Next')}
                                                </button>
                                            ) : <button
                                                disabled={submiting}
                                                onClick={submitForm}
                                                type="button"
                                                id="submit"
                                                className="submit">
                                                {__('Add')}
                                            </button>
                                            }
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a onClick={() => setShowMenu(!showMenu)}
                       className={`cursor-pointer cd-nav-trigger ${showMenu ? "close-nav" : ""}`}>

                        <span className="cd-icon"/>
                    </a>
                    <nav>
                        <ul className={`cd-primary-nav ${showMenu ? "fade-in" : ""}`}>
                            <li>
                                <Link href={route('home')} className="animated_link">
                                    {__('Home')}
                                </Link>
                            </li>
                            <li>
                                <Link href={route('about')} className="animated_link">
                                    {__('About_Us')}
                                </Link>
                            </li>
                            <li>
                                <Link href={route('contact')} className="animated_link">
                                    {__('Contact_Us')}
                                </Link>
                            </li>

                        </ul>
                    </nav>
                </>
            )}
        </>
    )
}
