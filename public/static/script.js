var idsFavorites = [];
var isShowingFavorites;

class CardModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			error: false,
			beer: null,
			isLoading: false,
			similarBeers: [],
		}	
	}

	componentWillMount() {
		this.loadBeerById();
	}

	componentWillReceiveProps(nextProps) {
		this.loadBeerById();
	}

	componentDidUpdate() {
		$('#beer-modal').modal('show');
	}

	loadBeerById = () => {
		this.setState({isLoading: true}, () => {

		const url = 'https://api.punkapi.com/v2/beers/' + this.props.id;
		const req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.onload = () => {
			const data = JSON.parse(req.response);
			this.setState({
				beer: data[0],
			});

			this.loadSimilarBeer();
		}
		req.send();});	
	}

	loadSimilarBeer = () => {
		const url = 'https://api.punkapi.com/v2/beers?page=' + (Math.floor(Math.random() * 76) + 1) + '&per_page=3';
		const req = new XMLHttpRequest();
		req.open('GET', url, true);
		 req.onload = () => {
			const data = JSON.parse(req.response);
			this.setState({
				similarBeers: [ ...data, ],
				isLoading: false,
			});
		}
		req.send();		
	}



	createCloseButton = () => {
		 return {__html: '&times;'};
	}

	render() {
		return (<div class="modal" id="beer-modal" tabindex="-1" role="dialog" >
		  	<div class="modal-dialog" role="document">

			    <div class="modal-content">
			      {this.state.beer &&

			      	<div class="modal-body">
				      	<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				          <span aria-hidden="true" dangerouslySetInnerHTML={this.createCloseButton()}></span>
				        </button>

				      	<div class="col-4 "  id="modal-img" >
				      		<img id="" src={this.state.beer.image_url} />
				      	</div>
				      	<div class="row">
				      		<h5>{this.state.beer.name}</h5>	
				     	</div>
				     	<div class="row">
				        
				        	<h6>{this.state.beer.tagline}</h6>
				      	</div>
				      	<hr/>	
				      	<div class="row">
				      		<div class="col-4">
				      			<p><strong>ABV</strong>: {this.state.beer.abv}</p>
				      		</div>
				      			
				      		<div class="col-4">
				      			<p><strong>IBU</strong>: {this.state.beer.ibu}</p>
				      		</div>
				        	
				        	<div class="col-4">
				        		<p><strong>EBC</strong>: {this.state.beer.ebc}</p>	
				        	</div>
				        		
				      	</div>
				        
				      	<div class="row">
				      		<p>{this.state.beer.description}</p>	
				      	</div>
				        
				        <div class="row">
				        	<h6><strong>Best Serverd with:</strong></h6>
				        	<ul>
				        		{this.state.beer.food_pairing.map(pairing => {
				        			return (<li>{pairing}</li>)
				        		})

				        		}
				        	</ul>
				        			
				        </div>
				       

				      </div>}
				       <div className="modal-footer">
				        	<div className='row'>
				        	{this.state.similarBeers.map(beer => {
				        		return (
				        			<div className='col-4'>
					        			<div className='card card-modal'>
					        				<div className='card-content'>
					        					<img className='card-img-top' src={beer.image_url} />
					        					<div className='card-body card-modal-body'>
					        						<h5>{beer.name}</h5>
					        						<p>{beer.tagline}</p>
					        					</div>
					        				</div>
					        			</div>
				        			</div>
				        		)
				        	})

				        	}
				        	</div>
				        </div>
			  	
			    </div>
		  	</div>
		</div>)
		
	}
}

class Cards extends React.Component {
	constructor(props) {
	    super(props);
	    
	    this.state = {
	      error: false,
	      hasMore: true,
	      isLoading: false,
	      items: [],
	      page: 1,
	      hasFilter: false,
	    };

	    this.openModal = this.openModal.bind(this);
	    
	    window.onscroll = () => {
	      const {
	        loadBeers,
	        state: {
	          error,
	          isLoading,
	          hasMore,
	          hasFilter,
	          isFavorite,
	        },
	      } = this;
	      
	      //early stop
	      if (error || isLoading || !hasMore || hasFilter || isFavorite) return;
	      
	      //cheks if window has scrolled all the way down
	      if (
	        window.innerHeight + document.documentElement.scrollTop
	        === document.documentElement.offsetHeight
	      ) {
	        loadBeers();
	      }
	    };
	  }
	
	//first load 
	componentWillMount() {
		this.loadBeers();
	}

	//handle input changes
	componentWillReceiveProps(nextProps) {
		if(this.props != nextProps){
			isShowingFavorites = nextProps.isFavorite;
			this.setState({items: [], page: 1,});
			this.loadBeers();
		}
	}
 	

  	loadBeers = () => {
	    this.setState({ isLoading: true}, () => {

	    	//Assign proper url
	      	var url = 'https://api.punkapi.com/v2/beers?%s';
	      	
	      	if(this.props.isFavorite){
	      		url = url.replace('%s', 'ids=' + idsFavorites.join("||"));
	      	} else if (this.props.name) {
	    		url = url.replace('%s', 'beer_name=' + this.props.name.replace(' ', '_'));
	    		this.setState({hasFilter: true,});
	    	} 
	    	else {
	    		url = url.replace('%s', 'page=' + this.state.page);
	    		this.setState({hasFilter: false,});
	    	}

	    	//API request
		    var req = new XMLHttpRequest();
		    req.open('GET', url, true);
		    req.onload = () => {
	        	var data = JSON.parse(req.response);
	        	
	        	this.setState({
	          		isLoading: false,
	          		items: [
	            		...this.state.items,
	            		...data,
	          		],
	          		page: this.state.page + 1,
	        	});     	
	      	};
	      	req.send();
	    })
	 }



	//open modal on item click
	openModal = (event) => {
		event.preventDefault();
		const element = document.getElementById('card-modal');
		ReactDOM.render(<CardModal id={this.getCardId(event.target)} />, element);
		
	}

	getCardId = (element) => {
		const bodyName = 'card-body';
		if(element.id) return element.id;
		if(element.parentElement.className == bodyName) return element.parentElement.parentElement.id;
		return element.parentElement.id;
	}

	star = (event) => {

		const favoriteStarClass = "favorite-star";
		var element = event.target;
		const beerId = element.id.substring(element.id.length - 1);

		if (element.classList.contains(favoriteStarClass)) {
			element.classList.remove(favoriteStarClass);
			idsFavorites.splice(idsFavorites.indexOf(beerId), 1);
			if (this.props.isFavorite) {
				const container = document.querySelector('#card-container');
				ReactDOM.render(<Cards isFavorite={this.props.isFavorite} />, container);
			}		
		} else {
			element.classList.add(favoriteStarClass);
			idsFavorites.push(beerId);	
		}
	
	}

	getFavorite = (id) => {
		return (idsFavorites.includes(String(id)) ? "favorite-star" : '')
	}

  	render() {
    	return (
    		<div className="row">{
          	this.state.items.map(
      			item => {
      				return (
	      				<div className="col-12 col-sm-12 col-md-6 col-lg-4">
	      					<div className="card hoverable" >
	      						<div className="star" >
			          				<span className={"oi " + this.getFavorite(item.id)} id={"star-" + item.id} data-glyph="star" onClick={this.star}></span>
			        			</div>
								<div className="card-content" id={item.id} onClick={this.openModal}>
		      						<img className="card-img-top" src={ item.image_url } />
		      						<div className="card-body">
		      							<h5 className="card-title">{ item.name }</h5>
		      							<p className="card-text">{ item.tagline }</p>
		      						</div>
	      						</div>
	      					</div>	
	      				</div>
	      			)
      			}
    		)}
    		</div>);
  	}

  	
 
}

class SearchBox extends React.Component {

	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	
	}

	//Event to filter cards
	handleChange = (event) => {
		var cardContainer = document.getElementById('card-container');
		ReactDOM.render(<Cards name={event.target.value} isFavorite={isShowingFavorites} />, cardContainer);
	}

	render() {
		return (
			<div className="input-group mb-3 col-sm-11 col-md-9 col-lg-4" id="search-bar">
				<input id type="text" className="form-control" onChange={this.handleChange} />
				<div className="input-group-append">
					<span className="input-group-text oi" data-glyph="magnifying-glass"></span>
				</div>
			</div>);
	}
}

class NavBar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isBelow: false,
		}

		window.onscroll = () => {
			const header = document.querySelector('.container-fluid');
			var isNewBelow = document.documentElement.scrollTop > header.scrollHeight;
			if(this.state.isBelow == isNewBelow) return;

			this.setState({isBelow: isNewBelow,}, () => {
				const btns = document.querySelectorAll('.btn-outline-light');
				btns.forEach(btn => {
					(isNewBelow)? btn.classList.add('btn-below-header') : btn.classList.remove('btn-below-header');
				});
			});
		}

		this.homeClick = this.homeClick.bind(this);
		this.favoriteClick = this.favoriteClick.bind(this);
	}

	homeClick = (e) => {
		e.preventDefault()
		var cardContainer = document.getElementById('card-container');
		ReactDOM.render(<Cards isFavorite={false} />, cardContainer);
	}

	favoriteClick = (e) => {
		e.preventDefault();
		var cardContainer = document.getElementById('card-container');
		ReactDOM.render(<Cards isFavorite={true} />, cardContainer);
	}

	render() {
		return(
			<div class="btn-group " role="group">
  				<button type="button" class="btn btn-outline-light" onClick={this.homeClick}>Home</button>
  				<button type="button" class="btn btn-outline-light" onClick={this.favoriteClick}>Favorites</button>
			</div>)
	}
}

//init
var cardContainer = document.getElementById('card-container');
ReactDOM.render(<Cards isFavorite={false} />, cardContainer);

var search = document.getElementById('search-box');
ReactDOM.render(<SearchBox />, search);

var nav = document.querySelector('nav');
ReactDOM.render(<NavBar />, nav);
