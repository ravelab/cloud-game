/**
 * Game list module.
 * @version 1
 */
const gameList = (() => {
    // state
    let allGames = [];
    let games = [];
    let gameIndex = 1;
    let gamePickTimer = null;

    const favorites = {
        'pacman': 'Pac-Man (A)',
        'gberet': 'Green Beret (A)',
        'nrallyx': '迷魂車',
        'ddragon': '雙截龍',
        '1943': '1943 (A)',
        'arkanoid': '打磚塊', 
        'dynwarj': '三國志',
        'dkong': 'Donkey Kong (A)',
        'rtype': 'R-Type (A)',
        'lkage': '影子傳說',
        'raiden': 'Raiden (A)',
        'twincobr': '究極虎',
        'nkdodge': '熱血高校',
        'sfj': '快打旋風',
        'bublbobl': '泡泡龍',
        'altbeastj': '獸王記',
        'goldnaxej': '戰斧',
        'galaxian': '小蜜蜂',
        'wofj': '三國志２',
        'nspiritj': '最後忍道',
        'shisen': '四川省：女子寮篇',
        'sf2j': '快打旋風２',
        'shinobi': '忍',
        'nbajam': 'NBA JAM (A)',
        // 'gladiatr': '黃金城',
        'mspacman': 'Ms Mac-Man (A)',
        'frogger': 'Frogger (A)',
//        'digdug': 'Dig Dug',
        'tmnt': '忍者龜',
        'Super Mario Bros': 'Super Mario Bros',
        'Super Bomberman 3': 'Super Bomberman 3',
        'Super Tetris 3': 'Super Tetris 3',
        'Rainbow Islands - The Story of Bubble Bobble 2': 'Rainbow Islands - The Story of Bubble Bobble 2',
        'Super Dodge Ball': 'Super Dodge Ball',
        'Mortal Kombat': 'Mortal Kombat',
        'Teenage Mutant Ninja Turtles IV - Turtles in Time': 'Teenage Mutant Ninja Turtles IV - Turtles in Time',
        'Contra': 'Contra',
    };
    
    let reverseFavorites = {};
    Object.keys(favorites).forEach(function(key) {
        const value = favorites[key];
        reverseFavorites[value] = key;
      });

    // UI
    const listBox = $('#menu-container');
    const menuItemChoice = $('#menu-item-choice');

    const MENU_TOP_POSITION = 102;
    let menuTop = MENU_TOP_POSITION;

    const filterInput = document.getElementById('room-txt')
    filterInput.addEventListener('keyup', (e) => {
        setFilter(e.target.value);
        show();
    });

    const setGames = (gameList) => {
        allGames = gameList.map(game => favorites[game] || game).sort((a, b) => a > b ? 1 : -1);
        games = allGames.filter(game => reverseFavorites[game]);
    };

    const setFilter = (text) => {
        if (text) {
            games = allGames.filter(game => game.toLowerCase().includes(text));
        } else {
            games = allGames;
        }
    };

    const render = () => {
        log.debug('[games] load game menu');

        listBox.html(games
            .map(game => `<div class="menu-item unselectable" unselectable="on"><div><span>${game}</span></div></div>`)
            .join('')
        );
    };

    const show = () => {
        render();
        menuItemChoice.show();
        pickGame();
    };

    const hide = () => {
        menuItemChoice.hide();
    };

    const pickGame = (index) => {
        let idx = undefined !== index ? index : gameIndex;

        // check boundaries
        // cycle
        if (idx < 0) idx = games.length - 1;
        if (idx >= games.length) idx = 0;

        // transition menu box
        listBox.css('transition', 'top 0.2s');
        listBox.css('-moz-transition', 'top 0.2s');
        listBox.css('-webkit-transition', 'top 0.2s');

        menuTop = MENU_TOP_POSITION - idx * 36;
        listBox.css('top', `${menuTop}px`);

        // overflow marquee
        $('.menu-item .pick').removeClass('pick');
        $(`.menu-item:eq(${idx}) span`).addClass('pick');

        gameIndex = idx;
    };

    const startGamePickerTimer = (upDirection) => {
        if (gamePickTimer !== null) return;

        log.debug('[games] start game picker timer');
        const shift = upDirection ? -1 : 1;
        pickGame(gameIndex + shift);

        // velocity?
        // keep rolling the game list if the button is pressed
        gamePickTimer = setInterval(() => {
            pickGame(gameIndex + shift);
        }, 200);
    };

    const stopGamePickerTimer = () => {
        if (gamePickTimer === null) return;

        log.debug('[games] stop game picker timer');
        clearInterval(gamePickTimer);
        gamePickTimer = null;
    };

    const onMenuPressed = (newPosition) => {
        listBox.css('transition', '');
        listBox.css('-moz-transition', '');
        listBox.css('-webkit-transition', '');
        listBox.css('top', `${menuTop - newPosition}px`);
    };

    const onMenuReleased = (position) => {
        menuTop -= position;
        const index = Math.round((menuTop - MENU_TOP_POSITION) / -36);
        pickGame(index);
    };

    const getCurrentGame = () => {
        const game = games[gameIndex];
        return reverseFavorites[game] || game;
    };

    event.sub(MENU_PRESSED, onMenuPressed);
    event.sub(MENU_RELEASED, onMenuReleased);

    return {
        startGamePickerTimer: startGamePickerTimer,
        stopGamePickerTimer: stopGamePickerTimer,
        pickGame: pickGame,
        show: show,
        hide: hide,
        set: setGames,
        getCurrentGame,
        setFilter: setFilter
    }
})($, event, log);
