import logo from './logo.svg';
import React from 'react';
import './App.css';
import Title from './components/Title';
import Form from './components/Form';
import MainCard from './components/MainCard';
import Favorites from './components/Favorites';

const jsonLocalStorage = {
	setItem: (key, value) => {
		localStorage.setItem(key, JSON.stringify(value));
	},
	getItem: (key) => {
		return JSON.parse(localStorage.getItem(key));
	},
};

const fetchCat = async (text) => {
	const OPEN_API_DOMAIN = "https://cataas.com";
	const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
	const responseJson = await response.json();
	return `${OPEN_API_DOMAIN}/cat/${responseJson._id}/says/${text}`; // NOTE: API 스펙 변경으로 강의 영상과 다른 URL로 변경했습니다.
};

const App = () => {
	const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
	const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
	const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";

	const [counter, setCounter] = React.useState(() => {
		return jsonLocalStorage.getItem("counter");
	});
	const [mainCat, setMainCat] = React.useState(CAT1);
	const [favorites, setFavorites] = React.useState(() => {
		return jsonLocalStorage.getItem("favorites") || [];
	});

	const alreadyFavorite = favorites.includes(mainCat);

	async function setInitialCat() {
		const newCat = await fetchCat('First cat');
		console.log(newCat);
		setMainCat(newCat);
	}

	React.useEffect(() => {
		setInitialCat();
	}, []);

	async function updateMainCat(value) {
		const newCat = await fetchCat(value);
		
		setMainCat(newCat);
		
		setCounter((prev) => {
			const nextCounter = prev + 1;
			jsonLocalStorage.setItem("counter", nextCounter);
			return nextCounter;
		});
	}

	function handelHeartClick() {
		const nextFavorites = [...favorites, mainCat];
		setFavorites(nextFavorites);
		jsonLocalStorage.setItem("favorites", nextFavorites);
	}

	const counterTitle = counter ? counter + "번째 " : "";

	return (
		<div>
			<Title>{counterTitle}고양이 가라사대</Title>
			<Form updateMainCat={updateMainCat} />
			<MainCard img={mainCat} onHeartClick={handelHeartClick} alreadyFavorite={alreadyFavorite} />
			<Favorites favorites={favorites} />
		</div>
	);
};

export default App;
