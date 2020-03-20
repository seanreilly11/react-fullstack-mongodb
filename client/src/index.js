import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Router from './components/Router';

// ReactDOM.render(<h1>Full stack</h1>, document.getElementById("root"));

class App extends Component{
	render(){
		return(
			<Router/>
		)
	}
}
ReactDOM.render(<App/>, document.getElementById("root"))