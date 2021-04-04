import React, { useEffect, useState } from 'react';
import API from "../../utils/API";
import AuthService from "../../services/authService";
import getUserProfile from "../../utils/getUserProfile";
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import '../../App.css'
import './Filter.css'



function Filter(props){
  const currentUser = AuthService.getCurrentUser();
  const [ageRange, setAgeRange] = React.useState([18, 65]);
  const [distance, setDistance] = React.useState(15);
  const [interestList, setInterestList] = useState([]);
  const [filterGender, setFilterGender] = useState([]);
  const [filterPolitics, setFilterPolitics] = useState([]);
  const [filterChildren, setFilterChildren] = useState([]);
  const [filterDrink, setFilterDrink] = useState([]);
  const [filterSmoke, setFilterSmoke] = useState([]);
  const [filterCannabis, setFilterCannabis] = useState([]);
  const [filterSign, setFilterSign] = useState([]);
  const [interestFilter, setInterestFilter] = useState([])
  const checkboxArray = document.getElementsByClassName('interests')

  const { filters } = getUserProfile()

  const genderOptions = ["Female", "Male","Non-binary", "Transgender", "Intersex", "No Preference"]
  const politicOptions = ["Conservative", "Moderate", "Liberal", "No Affiliation", "No Preference"]
  const smokeOptions = ["Regularly", "Socially", "Occasionally", "Never", "No Preference"]
  const drinkOptions = ["Regularly", "Socially", "Occasionally", "Never", "No Preference"]
  const cannabisOptions = ["Regularly", "Socially", "Occasionally", "Never", "No Preference"]
  const kidOptions = ["Has Children", "No Children", "No Preference"]
  const signOptions = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces', "No Preference"]
  
  let newState = []
  
  useEffect(() => {
    API.getInterests()
        .then(res => {
            setInterestList(res.data)
        })
        .catch(err => { 
            if (err.response) { 
            console.log('error with response')
            } else if (err.request) { 
                console.log('error with request') 
            } else { 
                console.log('something is not quite right') 
            } 
        });
  }, [])

  useEffect(() => {
    if(filters){
      setInterestFilter(filters.interests)
      setAgeRange(filters.ageRange)
      setDistance(filters.distance)
      setFilterCannabis(filters.cannabis)
      setFilterDrink(filters.drink)
      setFilterSmoke(filters.smoke)
      setFilterGender(filters.gender)
      setFilterPolitics(filters.politics)
      setFilterSign(filters.sign)
      setFilterChildren(filters.children)

    }
  }, [filters])

  const handleGenderChange = (newVal) => {
      newState = [...filterGender, newVal]
      if(newState.length > 1){
        newState.shift()
      }
      setFilterGender(newState)
  }
  
  const handlePoliticsChange = (newVal) => {
      newState = [...filterPolitics, newVal]
      if(newState.length > 1){
        newState.shift()
      }
      setFilterPolitics(newState)
  }
  
  const handleChildrenChange = (newVal) => {
      newState = [...filterChildren, newVal]
      if(newState.length > 1){
        newState.shift()
      }
      setFilterChildren(newState)
  }
  
  const handleDrinkChange = (newVal) => {
      newState = [...filterDrink, newVal]
      if(newState.length > 1){
        newState.shift()
      }
      setFilterDrink(newState)
  }
  
  const handleSmokeChange = (newVal) => {
      newState = [...filterSmoke, newVal]
      if(newState.length > 1){
        newState.shift()
      }
      setFilterSmoke(newState)
  }
  
  const handleCannabisChange = (newVal) => {
      newState = [...filterCannabis, newVal]
      if(newState.length > 1){
        newState.shift()
      }
      setFilterCannabis(newState)
  }
  
  const handleSignChange = (newVal) => {
      newState = [...filterSign, newVal]
      if(newState.length > 1){
        newState.shift()
      }
      setFilterSign(newState)
  }
  
  const handleAgeChange = (event, newValue) => {
      setAgeRange(newValue);
    };
  
  const handleDistanceChange = (event, newValue) => {
        setDistance(newValue);
      };
  
  function handleFormSubmit(e){
      e.preventDefault()
      const interestPreference = []

      for( var i = 0; i < checkboxArray.length; i ++){
          if (checkboxArray[i].children[0].checked === true){
              
              const choices = {
                  interest: checkboxArray[i].children[0].id,
                  _id: checkboxArray[i].children[0].dataset.id
              }
              interestPreference.push(choices)
          }
      }

      const object = { filterBy: [{
          distance: distance,
          gender: filterGender[0],
          politics: filterPolitics[0],
          ageRange: ageRange,
          children: filterChildren[0], 
          drink: filterDrink[0], 
          smoke: filterSmoke[0], 
          cannabis: filterCannabis[0],
          sign: filterSign[0],
          interests: interestPreference
      }]
      }
      
      API.editProfileByName(object, currentUser.username)
      .then(res => {
          })
      .catch(err => { 
          if (err.response) { 
            console.log('error with response')
          } else if (err.request) { 
              console.log('error with request') 
          } else { 
              console.log('um, sh*ts really broken') 
          } 
        });
  }
  
  const useStyles = makeStyles({
      root: {
        width: 300,
      },
    });
  
    const classes = useStyles();
    
    function valuetext(value) {
      return `${value}`;
    }
  
  
      const marks = [
          {
            value: 20,
            label: '20',
          },
          {
            value: 30,
            label: '30',
          },
          {
            value: 40,
            label: '40',
          },
          {
            value: 50,
            label: '50',
          },
          {
            value: 60,
            label: '60'
          },
        ];
      
return (
  <div className="container">
          <div className="profileCard card">
              <h1>Pick how you'd like to filter your friends:</h1>
              <div className={classes.root}>
                  <div className="distanceSlider">
              <Typography id="discrete-slider" gutterBottom>
                  Distance:
              </Typography>
              <Slider
                  value={distance}
                  onChange={handleDistanceChange}
                  defaultValue={15}
                  getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={50}
              />
              <Badge variant="info"> Distance: {distance} miles</Badge>
              </div>
              <div className="ageSlider">
                  <Typography id="range-slider" gutterBottom>
                      Age Range:
                  </Typography>
                  <Slider
                      value={ageRange}
                      onChange={handleAgeChange}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      getAriaValueText={valuetext}
                      min={18}
                      max={66}
                      marks={marks}
                  />
              </div>
                  <Badge variant="info">Age Range: {ageRange[0]+' - '+ageRange[1]} years old</Badge>
                  
              </div>
              <h4>Gender:</h4>
              <ToggleButtonGroup type="checkbox" name="gender" onChange={handleGenderChange} >
                {genderOptions.map((item, index) =>  
                  { if(filterGender.includes(item) === true){ return (<ToggleButton variant="info" value={item} className="active" key={index}>{item}</ToggleButton>)} 
                    else { return (<ToggleButton variant="info" value={item} key={index}>{item}</ToggleButton>)} })}
              </ToggleButtonGroup>
              <h4>Political Affiliation:</h4>
              <ToggleButtonGroup type="checkbox" name="politics" onChange={handlePoliticsChange}>
                {politicOptions.map((item, index) =>  
                  { if(filterPolitics.includes(item) === true){ return (<ToggleButton variant="info" value={item} className="active" key={index}>{item}</ToggleButton>)} 
                    else { return (<ToggleButton variant="info" value={item} key={index}>{item}</ToggleButton>)} })}
              </ToggleButtonGroup>
              <h4>Children:</h4>
              <ToggleButtonGroup type="checkbox" name="children" onChange={handleChildrenChange}>
                {kidOptions.map((item, index) =>  
                  { if(filterChildren.includes(item) === true){ return (<ToggleButton variant="info" value={item} className="active" key={index}>{item}</ToggleButton>)} 
                    else { return (<ToggleButton variant="info" value={item} key={index}>{item}</ToggleButton>)} })}
              </ToggleButtonGroup>
              <h4>Drinks:</h4>
              <ToggleButtonGroup type="checkbox" name="drink" onChange={handleDrinkChange}>
                {drinkOptions.map((item, index) =>  
                  { if(filterDrink.includes(item) === true){ return (<ToggleButton variant="info" value={item} className="active" key={index}>{item}</ToggleButton>)} 
                    else { return (<ToggleButton variant="info" value={item} key={index}>{item}</ToggleButton>)} })}
              </ToggleButtonGroup>
              <h4>Smokes:</h4>
              <ToggleButtonGroup type="checkbox" name="smoke" onChange={handleSmokeChange}>
                {smokeOptions.map((item, index) =>  
                  { if(filterSmoke.includes(item) === true){ return (<ToggleButton variant="info" value={item} className="active" key={index}>{item}</ToggleButton>)} 
                    else { return (<ToggleButton variant="info" value={item} key={index}>{item}</ToggleButton>)} })}
              </ToggleButtonGroup>
              <h4>Uses cannabis:</h4>
              <ToggleButtonGroup type="checkbox" name="cannabis" onChange={handleCannabisChange}>
                {cannabisOptions.map((item, index) =>  
                  { if(filterCannabis.includes(item) === true){ return (<ToggleButton variant="info" value={item} className="active" key={index}>{item}</ToggleButton>)} 
                    else { return (<ToggleButton variant="info" value={item} key={index}>{item}</ToggleButton>)} })}
              </ToggleButtonGroup>
              <h4>Sign:</h4>
               <ToggleButtonGroup type="checkbox" name="sign" onChange={handleSignChange}>
                {signOptions.map((item, index) =>  
                  { if(filterSign.includes(item) === true){ return (<ToggleButton variant="info" value={item} className="active" key={index}>{item}</ToggleButton>)} 
                    else { return (<ToggleButton variant="info" value={item} key={index}>{item}</ToggleButton>)} })}
               </ToggleButtonGroup>
              <h4>Interests:</h4>
              <Form type="checkbox">
                  <div className="mb-3">
                  {interestList.map((item) => {if(interestFilter.includes(item.interest) === true) {return (
                      <Form.Check inline key={item._id} className="interests active" label={item.interest} type="checkbox" id={item.interest} data-id={item._id} />
                  )} else {return (
                      <Form.Check inline key={item._id} className="interests" label={item.interest} type="checkbox" id={item.interest} data-id={item._id} />
                  )}})}
                  </div>
              </Form>

              <Button variant="info" onClick={handleFormSubmit}>Save</Button>
          </div>
      </div>
)
}

export default Filter;