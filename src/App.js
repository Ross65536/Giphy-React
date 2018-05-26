import React, { Component } from 'react';

import './App.css'

// for ajax
import $ from 'jquery';

const GIPHY_SEARCH = 'https://api.giphy.com/v1/gifs/search';

function appendURIObject(url, object) {
    return url + "?" + $.param(object);
}

class GifCard extends Component {

    render() {

        return (
            <div className="card">
                <img className="card-img-top" src={this.props.giphy.images.downsized.url} alt="card gif" />
                <div className="card-body">
                    <a href="#" className="btn btn-primary">Save GIF</a>
                </div>
            </div>
            
        );
    }
}

class GifIndexPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchResult: []
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);

    }


    handleSubmit(event) {
        let searchData = {
            'api_key': 'iXiRTapoKR9zI25YGOU1tJGIAx8JrTr8',
            'q': this.state.searchText
        };
        const requestURL = appendURIObject(GIPHY_SEARCH, searchData);

        $.ajax({
            url: requestURL,
            type: "GET",
            dataType: "json",
            success: (responseObj) => {
                console.log(responseObj);
                const dataArr = responseObj.data;
                const pagination = responseObj.pagination;

                this.setState({
                    ...this.state,
                    searchResult: dataArr
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("An error occured");
            }
        })


        event.preventDefault();
    }

    handleSearchChange(event) {
        this.setState({
            ...this.state,
            searchText: event.target.value
        });
        event.preventDefault();
    }

    getGifs() {
        const giphyObjects = this.state.searchResult;
        return giphyObjects.map((image => <GifCard key={image.id} giphy={image} />
        ));
    }

    getBody() {
        return this.getGifs();
    }

    render() {
        return (
            <div>
                {/* Header */}
                <nav className="navbar navbar-light bg-light justify-content-between sticky-top">
                    <a className="navbar-brand">Giphy Save</a>
                    <form className="form-inline" id="header-search" role="search" onSubmit={this.handleSubmit}>
                        <input type="text" className="form-control" placeholder="Search" onChange={this.handleSearchChange} />
                        <button type="submit" className="btn btn-default">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                    <button type="button" className="btn btn-primary"><i className="far fa-bookmark"></i> </button>
                </nav>

                {/* Body */}
                <div id="body" className="container mt-3">
                    <div className="card-columns">
                        {this.getBody()}
                    </div>
                </div>
            </div>
        );
    }
}



export default GifIndexPage;