let dictionaryForm = document.forms["dictionary"];
let word = document.forms["dictionary"]["searchInput"];
dictionaryForm.addEventListener("submit", search);

function search(e) {
  e.preventDefault();
  dictionarySearch(word);
}

async function dictionarySearch(word) {
  let dictionaryAPI = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.value}`;
  let response = await fetch(dictionaryAPI);

  let data = await response.json();

  let hr;

  let searchWord;
  let wordSpeaker;
  let wordAudio;
  let wordPhonetic;
  let wordDetails;

  searchWord = document.querySelector("#searchWord");
  wordSpeaker = document.querySelector("#wordSpeaker");
  wordAudio = document.querySelector("#wordAudio");
  wordPhonetic = document.querySelector("#wordPhonetic");
  wordDetails = document.querySelector("#wordDetails");
  hr = document.querySelector("#hr");

  searchWord.innerHTML = "";
  wordPhonetic.innerHTML = "";
  wordAudio.innerHTML = "";
  wordSpeaker.innerHTML = "";
  wordDetails.innerHTML = "";

  let partOfSpeech;
  let wordDefinition;
  let wordExample;
  let definitionList;
  let wordSynonyms;
  let wordAntonyms;

  let arrayOfWordSynonym;
  let arrayOfWordAntonym;

  let audioURL;
  // let arrayOfAudioURL = [];
  // let arrayOfWordPhonetic = [];

  if (typeof data[Symbol.iterator] !== "function") {
    searchWord.innerHTML = ` The word you searched is "${word.value}" and ${data.title}`;
    hr.style.display = "none";
    return;
  }

  for (let arrayObject of data) {
    //Todo  Word
    if (arrayObject["word"]) {
      let getWord;
      let getWordToUpperCase;
      getWord = arrayObject["word"];
      getWordToUpperCase = getWord.charAt(0).toUpperCase() + getWord.slice(1);
      searchWord.innerHTML = getWordToUpperCase;
    }

    //Todo  Phonetic
    if (arrayObject["phonetic"] !== undefined) {
      wordPhonetic.innerHTML = arrayObject["phonetic"];
    }

    //Todo  Audio
    //!   Write it as an Array
    for (let pronunciation of arrayObject["phonetics"]) {
      // arrayOfAudioURL.push(pronunciation["audio"]);
      // if (arrayOfAudioURL.length > 0) {
      //   wordSpeaker.style.display = "inline-block";
      //   wordSpeaker.addEventListener("click", () => {
      //     wordAudio.innerHTML = `<audio controls autoplay><source src="${
      //       arrayOfAudioURL[0] || arrayOfAudioURL[1]
      //     }"></audio>`;
      //   });
      // }
      // else {
      //   wordSpeaker.style.display = "none";
      // }
      audioURL = pronunciation["audio"];
      if (audioURL !== undefined) {
        wordSpeaker.style.display = "inline-block";
        wordSpeaker.addEventListener("click", () => {
          wordAudio.innerHTML = `<audio controls autoplay><source src="${audioURL}"></audio>`;
        });
        // break;
      } else {
        wordSpeaker.style.display = "none";
      }
    }
    hr.style.display = "block";

    //Todo   Meaning
    for (let meaningObject of arrayObject["meanings"]) {
      //Todo Part of speech
      let getPartOfSpeech;
      let partOfSpeechToUpperCase;
      partOfSpeech = document.createElement("h4");
      getPartOfSpeech = meaningObject["partOfSpeech"];
      partOfSpeechToUpperCase =
        getPartOfSpeech.charAt(0).toUpperCase() + getPartOfSpeech.slice(1);
      partOfSpeech.innerHTML = `<span style = 'color:orange; padding-left:12px'>${partOfSpeechToUpperCase}</span>`;
      wordDetails.appendChild(partOfSpeech);

      //Todo  Definitions and Examples
      definitionList = document.createElement("ol");
      definitionList.className = "orderedList";
      definitionList.style.listStyleType = "decimal";

      for (let definitionObject of meaningObject["definitions"]) {
        //Todo  Definition
        wordDefinition = document.createElement("li");
        wordDefinition.innerHTML = `${definitionObject["definition"]}`;
        wordDefinition.style.paddingTop = "5px";

        //Todo  Example
        if (definitionObject["example"]) {
          wordExample = document.createElement("p");
          wordExample.innerHTML = `<span style = 'color:brown; font-style: italic'>${definitionObject["example"]}</span>`;
          wordDefinition.appendChild(wordExample);
        }
        definitionList.appendChild(wordDefinition);
      }
      wordDetails.appendChild(definitionList);

      //Todo Synonyms and Antonyms
      arrayOfWordSynonym = meaningObject["synonyms"];
      arrayOfWordAntonym = meaningObject["antonyms"];

      //Todo Synonyms
      if (arrayOfWordSynonym.length > 0) {
        wordSynonyms = document.createElement("p");
        wordSynonyms.innerHTML = `<span style= 'color:green; font-style: italic'>Synonyms: </span>`;
        for (let i = 0; i < arrayOfWordSynonym.length; i++) {
          if (i === arrayOfWordSynonym.length - 1) {
            wordSynonyms.innerHTML += `<span style= 'font-style: italic'>${arrayOfWordSynonym[i]}</span>.`;
          } else {
            wordSynonyms.innerHTML += `<span style= 'font-style: italic'>${arrayOfWordSynonym[i]}</span>, `;
          }
        }
        wordDetails.appendChild(wordSynonyms);
      }

      //Todo Antonyms
      if (arrayOfWordAntonym.length > 0) {
        wordAntonyms = document.createElement("p");
        wordAntonyms.innerHTML = `<span style= 'color:green; font-style: italic'>Antonyms: </span>`;
        for (let i = 0; i < arrayOfWordAntonym.length; i++) {
          if (i === arrayOfWordAntonym.length - 1) {
            wordAntonyms.innerHTML += `<span style= 'font-style: italic'>${arrayOfWordAntonym[i]}</span>.`;
          } else {
            wordAntonyms.innerHTML += `<span style= 'font-style: italic'>${arrayOfWordAntonym[i]}</span>, `;
          }
        }
      }
      wordDetails.innerHTML += "<hr>";
    }
  }
}
