/* global $ */

// Get DOM Elements
const buttonContainer = $('#button-container');
const chatContainer = $('#chat-container');
const chatShownTextSpan = $('#chat-shown-text');
const chatHiddenTextSpan = $('#chat-hidden-text');
const editContainer = $('#edit-container');
const nameInput = $('#name-input');
const likeList = $('#like-list');
const dislikeList = $('#dislike-list');
const wishList = $('#wish-list');

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
const showEdit = () => {
  // Clear fields
  likeList.empty();
  dislikeList.empty();
  wishList.empty();
  
  // Set fields
  nameInput.val(assetData.name);
  assetData.like.forEach(like => {
    likeList.append($(`<li><input type="text" value="${like}"></li>`));
  });
  assetData.dislike.forEach(dislike => {
    dislikeList.append($(`<li><input type="text" value="${dislike}"></li>`));
  });
  assetData.wish.forEach(wish => {
    wishList.append($(`<li><input type="text" value="${wish}"></li>`))
  });
  
  editContainer.fadeIn(FADE_DURATION);
};

const hideEdit = () => {
  editContainer.fadeOut(FADE_DURATION);
};

$('#cancel-button').on('click', () => {
  hideEdit();
});