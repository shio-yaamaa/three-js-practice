/* global $ */

// Get DOM Elements
const buttonContainer = $('#button-container');
const chatContainer = $('#chat-container');
const chatShownTextSpan = $('#chat-shown-text');
const chatHiddenTextSpan = $('#chat-hidden-text');
const editContainer = $('#edit-container');
const likesButton = $('#likes-button');
const dislikesButton = $('#dislikes-button');
const wishesButton = $('#wishes-button');

let assetType;
let assetData = {};

// Menu
const showZoomMenu = (zoomedAssetType, zoomedAssetData) => {
  assetType = zoomedAssetType;
  Object.assign(assetData, zoomedAssetData);
  buttonContainer.fadeIn(FADE_DURATION);
};

const hideZoomMenu = () => {
  buttonContainer.fadeOut(FADE_DURATION);
  hideChat();
  hideEdit();
}

// Set button listeners
$('#chat-button').on('click', () => {
  showChat();
  hideEdit();
});
$('#edit-button').on('click', () => {
  hideChat();
  showEdit();
});
$('#map-button').on('click', () => {
  hideChat();
  hideEdit();
});
$('#home-button').on('click', () => {
  $('#overlay').fadeIn(HOME_LINK_DURATION, () => {
    window.location.href = "world.html";
  });
});

// Chat
let chatTimer;

const typewrite = () => {
  chatShownTextSpan.text(chatShownTextSpan.text() + chatHiddenTextSpan.text().charAt(0));
  chatHiddenTextSpan.text(chatHiddenTextSpan.text().substring(1));
  if (chatHiddenTextSpan.text().length > 0) {
    chatTimer = setTimeout(typewrite, TYPEWRITE_INTERVAL);
  }
};

const showChat = () => {
  clearTimeout(chatTimer);
  
  // Define the text to show
  let text;
  const topic = ['name', 'like', 'dislike', 'wish'][Math.floor(Math.random() * 4)];
  switch (topic) {
    case 'name':
      text = `I'm ${assetData.name}! Nice to meet you.`;
      break;
    case 'like':
      text = `I like ${concatenate(assetData.like)}♡♡`;
      break;
    case 'dislike':
      text = `I don't like ${concatenate(assetData.dislike)}...`;
      break;
    case 'wish':
      text = `I wish ${concatenate(assetData.wish)}!`;
      break;
  }
  
  chatShownTextSpan.text('');
  chatHiddenTextSpan.text(text);
  chatContainer.show();
  typewrite();
}

const hideChat = () => {
  clearTimeout(chatTimer);
  chatContainer.hide();
}

// Edit
let currentConstellation;

const showEdit = () => {
  document.body.style.background = `radial-gradient(#09123b, #03020a)`;
  editRendering.start();
  editRendering.toggleCameraControls(true);
  editContainer.fadeIn(FADE_DURATION); // Don't delete it because it contains action buttons
  changeTopic('like');
};

const hideEdit = () => {
  editContainer.fadeOut(FADE_DURATION);
};

const changeTopic = topic => {
  currentConstellation && currentConstellation.close(() => currentConstellation.show());
  const texts = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  currentConstellation = new Constellation(texts, data.mamuka[1], editRendering.scene, editRendering.camera, -15, 3, CONSTELLATION_COLORS[topic]);
};

$('#likes-button').on('click', () => changeTopic('likes'));
$('#dislikes-button').on('click', () => changeTopic('dislikes'));
$('#wishes-button').on('click', () => changeTopic('wishes'));

// Enter and delete
$('.like-input').keyup(event => {
  console.log(event.keyCode);
  if (event.keyCode === 13) {
    console.log('enter');
  }
});

$('#cancel-button').on('click', () => {
  hideEdit();
});