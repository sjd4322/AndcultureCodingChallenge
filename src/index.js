import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from 'react-bootstrap/ListGroup';
import GoogleMapReact from 'google-map-react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function BreweryApplication(){
    return (<Router>
        <Route exact path="/" component={BreweryList}/>
        <Route path="/brewerydetails/:name/:street/:city/:state/:longitude/:latitude" component={BreweryDetails}/>
    </Router>)
}

class BreweryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };      
    }

    componentDidMount(){
        fetch("https://api.openbrewerydb.org/breweries?by_city=pittsburgh&by_state=pennsylvania")
            .then(res => res.json())
            .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    items: result
                });
            },
            (error) => {
                this.setState({
                isLoaded: true,
                error
            });
        });        
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
            <ListGroup>
                {items.map(item => (
                    <ListGroup.Item key={item.name} variant="dark">
                        <ul>
                            <li>{item.name}</li>
                            <li>{item.brewery_type}</li>
                            <li>{item.street}, {item.city}, {item.state}</li>
                            <li><a href={item.website_url}>{item.website_url}</a></li>

                            <Link to={"/brewerydetails/" + item.name + "/" + item.street + "/" + item.city + "/" + item.state + "/" + item.longitude + "/" + item.latitude}>View Details</Link>
                        </ul>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            );
        }
    }
}

function BreweryDetails(props){

    return(
        <div class="jumbotron">
            <h1>{props.match.params.name}</h1>
            <h2>{props.match.params.street}, {props.match.params.city}, {props.match.params.state}</h2>

            <MiniMap latitude={props.match.params.latitude} longitude={props.match.params.longitude} name={props.match.params.name} />
            <Link to="/">Return to List</Link>
        </div>
    );
}

const MiniMap = ({ latitude, longitude, name }) => (
    <div style={{height: '500px', width: '500px', position: 'relative'}}>
        <GoogleMapReact bootstrapURLKeys={{ key: "AIzaSyC9SnVttN62YUoKV8pU3c8J44M1oHlcsXo" }}
            center={{ latitude, longitude }}
            defaultCenter={{ lat:37.0902, lng:95.7129}}
            defaultZoom={11}
            centerAroundCurrentLocation={true}
            zoom={11}
            resetBoundsOnResize={true}>
            <AnyReactComponent
                lat={latitude}
                lng={longitude}
                text={name}
            />
        </GoogleMapReact>
    </div>
);

ReactDOM.render(<BreweryApplication />, document.getElementById('root'));
serviceWorker.register();