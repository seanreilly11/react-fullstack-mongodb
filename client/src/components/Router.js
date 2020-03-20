import React, {Component} from 'react';
import axios from 'axios';

class Router extends Component{
	state=[
	{
		name : "Notebook",
		price: 12,
		userId : "5e5f0999f493d90e27d0c100"
	},
	{
		name : "Laptop",
		price: 1302,
		userId : "5e5f0999f493d90e27d0c100"
	}
	]
	componentDidMount(){
		
		// this.deleteProduct();
		this.addProduct();
		this.getProduct();
	}

	getProduct = () => {
		console.log("Get product called");
		axios.get(`http://192.168.33.10:5000/dbProducts`)
		.then(res => {
			console.log(res.data)
		})
	}

	addProduct = () => {
		console.log("Add product called");
		const post = {
			name : this.state[0].name,
			price : this.state[0].price,
			userId : this.state[0].userId
		}
		axios.post(`http://192.168.33.10:5000/addProduct`, post)
		.then(res => {
			console.log(res.data)
		})
	}

	deleteProduct = () => {
		console.log("Delete product called");
		axios.delete(`http://192.168.33.10:5000/deleteProduct/5e7419a7f2f9a712fc4c2a99`)
		.then(res => {
			console.log(res.data)
		})
	}

	render(){
		return(<h1>Getting products</h1>)
	}
}

export default Router;