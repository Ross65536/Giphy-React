import React, { Component } from 'react';

import './App.css'

// for ajax
import $ from 'jquery';

const GIPHY_SEARCH = 'https://api.giphy.com/v1/gifs/search';

function appendURIObject(url, object) {
    return url + "?" + $.param(object);
}

class GifCard extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            bBookmarked: props.bContainsBookmark,
        };

        this.toggleBookmark = this.toggleBookmark.bind(this);

    }

    toggleBookmark(event) {
        const bMarked = ! this.props.toggleBookmark(this.props.giphy);
        this.setState({
            ...this.state,
            bBookmarked: bMarked,
        });
        event.preventDefault();
    }

    render() {
        let bookMarkIcon = this.state.bBookmarked ?  <i className="fas fa-bookmark"></i> : <i className="far fa-bookmark"></i>;

        return (
            <div className="card">
                <img className="card-img-top" src={this.props.giphy.images.downsized.url} alt="card gif" />
                <div className="card-body">
                    <a href="#" className="btn btn-primary" onClick={this.toggleBookmark}>
                        {bookMarkIcon}
                    </a>
                </div>
            </div>
            
        );
    }
}

class GifIndex extends Component {

    
    render() {
        const giphyObjects = this.props.gifs;
        let cards = giphyObjects.map((
            image => <GifCard key={image.id} giphy={image} toggleBookmark={this.props.toggleBookmark} bContainsBookmark={this.props.containsBookmark(image)}/>
        ));

        return (
            <div className="card-columns">
                {cards}
            </div>
        );
    }
}

class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            gifs: [],
            bookmarks: [],
            bBookmarksOpen: false,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.containsBookmark = this.containsBookmark.bind(this);
        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.indexOfBookmark = this.indexOfBookmark.bind(this);
    }

    indexOfBookmark(obj) {
        const bookmarks = this.state.bookmarks;

        for(let i=0; i < bookmarks.length; i++ ) {
            const bookmark = bookmarks[i];
            if(bookmark.id == obj.id)
                return i;
        }

        return -1;
    }

    containsBookmark(obj) {
        const bValue = this.indexOfBookmark(obj) >= 0;

        return bValue;
    }

    toggleBookmark(obj) {
        let modBookmarks = this.state.bookmarks.slice();
        const index = this.indexOfBookmark(obj);
        const bExists = index >= 0;
        if(bExists)
            modBookmarks.splice(index, 1); //remove
        else 
            modBookmarks.push(obj);

        this.setState({
            ...this.state,
            bookmarks: modBookmarks
        });
        
        return bExists;
    }


    handleSubmit(event) {
        this.setBookmarksOpen(false);

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
                const dataArr = responseObj.data;
                const pagination = responseObj.pagination;

                this.setState({
                    ...this.state,
                    gifs: dataArr
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

    getBody() {
        if(this.state.bBookmarksOpen)
            return <GifIndex gifs={this.state.bookmarks} toggleBookmark={this.toggleBookmark} containsBookmark={this.containsBookmark} />;
        else
            return <GifIndex gifs={this.state.gifs} toggleBookmark={this.toggleBookmark} containsBookmark={this.containsBookmark} />;
    }

    setBookmarksOpen(bOpen) {
        this.setState({
            ...this.state,
            bBookmarksOpen: bOpen
        });
    }

    toggleBookmarksPage() {
        const neg = ! this.state.bBookmarksOpen;
        this.setBookmarksOpen(neg);
        console.log(this.state.bookmarks);
    }

    render() {

        let bookMarkIcon = this.state.bBookmarksOpen ?  <i className="fas fa-bookmark"></i> : <i className="far fa-bookmark"></i>;

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
                    <button type="button" className="btn btn-primary" onClick={ this.toggleBookmarksPage.bind(this) }>
                        {bookMarkIcon}
                    </button>
                </nav>

                {/* Body */}
                <div id="body" className="container mt-3">
                    {this.getBody()}
                </div>
            </div>
        );
    }
}



export default MainPage;