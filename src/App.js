
import './App.scss';
import React from 'react';

const WINNERS_DATA = [{
	name: 'Kurt Gooden',
  company: 'Ritual',
	urlSrc: 'https://imgur.com/ea1wnTe.png'
}, {
	name: 'Jessica Miano',
  company: 'Drizly',
	urlSrc: 'https://imgur.com/e2jFIDJ.png'
}, {
	name: 'James Stolp',
  company: 'CSC Service Works',
	urlSrc: 'https://imgur.com/tdZ4P8y.png'
}, {
	name: 'Birk Jernstorm',
  company: 'Shopify',
	urlSrc: 'https://imgur.com/z9FFHwi.png'
}, {
	name: 'John Dickson',
  company: 'Hibbet Sports',
	urlSrc: 'https://imgur.com/Hw1JzIY.png'
}, {
	name: 'Laura Reurich',
  company: 'BNext',
	urlSrc: 'https://imgur.com/4djYqSw.png'
}, {
	name: 'Victor Camarago',
  company: 'Wannalisn',
	urlSrc: 'https://imgur.com/MbnoOx7.png'
}]

const Heading = ({
	title,
  subtitle,
  url
}) => (
	<div className="heading-container">
	  <div className="heading-title">{title}</div>
    <div className="heading-subtitle">{subtitle}</div>
    <img className="heading-img" src={url} />
	</div>
);

const AwardedPerson = ({
	name, company, urlSrc
}) => (
	<div className="awarded-person">
	  <img src={urlSrc} />
    <div className="person-name">{name}</div>
    <div className="person-company">{company}</div>
	</div>
);

const AWARD_PERSON_MAX_WIDTH = 200;
const REFRESH_WINNERS_INTERVAL = 3000;
let setIntervalRef = null;
class AwardPersonList extends React.Component {

	constructor(props) {
    super(props);
    
    this.listContainerRef = React.createRef();
    this.state = { 
    	filteredWinners: [],
      lastShownIndex: 0,
      width: 0,
    };
  }
  
  updateWidth = () => {
  	const { width } = this.listContainerRef.current.getBoundingClientRect();
    this.setState({
    	width
    });
    this.updateWinners();
  }
  
  componentDidMount = () => {
  	window.addEventListener('resize', this.updateWidth);
    this.updateWidth();
    this.updateWinners();
    this.startRefreshingWinners();
  }
  
  startRefreshingWinners = () => {
    clearInterval(this.setIntervalRef);
    this.setIntervalRef = setInterval(this.updateWinners, REFRESH_WINNERS_INTERVAL);
  }
  
  componentWillUnmount = () => {
  	window.removeEventListener('resize', this.updateWidth);
  }
  
  updateWinners = () => {
  	const { width, lastShownIndex } = this.state;
    const { winners } = this.props;
    if(winners.length) {
      const totalWinnersToShow = Math.floor(width/AWARD_PERSON_MAX_WIDTH)*2;
      if (totalWinnersToShow < winners.length) {
        const startingAt = lastShownIndex % winners.length;
        const endingAt = (startingAt + totalWinnersToShow) % winners.length;

        let filteredWinners;
        if(startingAt > endingAt) {
          filteredWinners = [...winners].slice(startingAt, winners.length);
          filteredWinners = filteredWinners.concat([...winners].slice(0, endingAt));
        } else {
          filteredWinners = [...winners].slice(startingAt, endingAt);
        }
        this.setState({
        lastShownIndex: endingAt,
        filteredWinners,
      });
      } else {
      	this.setState({
        	filteredWinners: [...winners]
        });
      }
    }
  };
	
  render() {
  	const { filteredWinners } = this.state;
    return (
      <div className="award-person-list" ref={this.listContainerRef}>{filteredWinners.map(winner => (
        <AwardedPerson {...winner} key={winner.urlSrc} />
      ))}</div>
    );
  }
}

const Footer = () => (
	<div className="footer">
	  <div>
      <span className="footer-marked">Presented By </span><span className="footer-company">Branch</span>
    </div>
	</div>
);

const headingTitle = <span>Mobile Growth <span className="title-marked">Awards</span></span>;
const headingSubtitle = "Most Inonvative Mobile Campaign 2020";
const headingUrl = "https://imgur.com/fA66Qlq.png";
const backgroundImg = "https://imgur.com/sKdebci.png";
const backgroundImageStyle = { backgroundImage: `url(${backgroundImg})` };
const HarnessIOApp = () => {

	const [winners, setWinners] = React.useState([]);
  React.useEffect(() => {
  	//simulate fetch data
    setWinners(WINNERS_DATA);
  }, []);
  
	return (
    <div className="harness-io" style={backgroundImageStyle}>
      <Heading title={headingTitle} subtitle={headingSubtitle} url={headingUrl} />
      <AwardPersonList winners={winners} />
      <Footer />
    </div>
  );
};

export default HarnessIOApp;
