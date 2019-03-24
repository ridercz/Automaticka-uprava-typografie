const all = document.getElementsByTagName("*");
const inLineElements = ["B", "BIG", "I", "SMALL", "TT", "ABBR", "ACRONYM", "CITE", "CODE", "DFN", "EM", "KDB", "STRONG", "SAMP", "VAR", "A", "BDO", "BR", "IMG", "MAP", "OBJECT", "Q", "SPAN", "SUB", "SUP", "BUTTON", "INPUT", "LABEL", "SELECT", "TEXTAREA"];
const ignoredElemenents = ["SCRIPT", "NOSCRIPT", "STYLE", "TITLE", "IFRAME", "BODY", "HEAD", "META", "HTML", ""];
const usellesChar = "\u035B";
const Rules = {

    // rules for czech quotes

    quote: [

      [/(“|"|“)(\w)/g, "„$2"],

      [/(”|")( |,|\n*|$)/g, "“$2"],

      [/(!|\?|\.)(”|")/g, "$1“"],

      [/(\w)(')(\w)/g, "$1’$3"]

    ],


    // rules for units

    // there must be a space between numbers and the unit

    units: [

      [/(\d+)(| )(|m)s /g, "$1"+"\u00a0"+"$3s "],

      [/(\d+)(| )(min|h|d) /g, "$1"+"\u00a0"+"$3 "],

      [/(\d+)(| )(|n|m|c|d|k)m /g, "$1"+"\u00a0"+"$3m "],

      [/(\d+)(| )(|m|h|d|c|b)l /g, "$1"+"\u00a0"+"$3l "],

      [/(\d+)(| )(ccm|gal) /g, "$1"+"\u00a0"+"$3 "],

      [/(\d+)(| )(|m|c|d|k)m(\d) /g, "$1"+"\u00a0"+"$3m$4 "],

      [/(\d+)(| )(ccm|gal) /g, "$1"+"\u00a0"+"$3 "],

      [/(\d+)(| )(ha|a) /g, "$1"+"\u00a0"+"$3 "],

      [/(\d+)(| )(|k|M)J /g, "$1"+"\u00a0"+"$3J "],

      [/(\d+)(| )(|k)cal /g, "$1"+"\u00a0"+"$3cal "],

      [/(\d+)(| )(|kWh|M)Wh /g, "$1"+"\u00a0"+"$3Wh "],

      [/(\d+)(| )(|k)m\/(s|min|h) /g, "$1"+"\u00a0"+"$3m/$4 "],

      [/(\d+)(| )(K|°C|°F) /g, "$1"+"\u00a0"+"$3 "],

      [/(\d+)(| )(|h|k|M)Pa /g, "$1"+"\u00a0"+"$3Pa "],

      [/(\d+)(| )(bar|atm) /g, "$1"+"\u00a0"+"$3 "],

      [/(\d+)(| )(|k)W /g, "$1"+"\u00a0"+"$3 "],

      [/(\d+)(| )(%) /g, "$1"+"\u00a0"+"$3 "],

      [/(|m|c|d|k)m(\d) /g, "$1m<sup>$2</sup> "]

    ],

    // rule for number formatting

    number: [

      [/(\d)(?=(\d{3})+(?!\d))/g, "$1 "]

    ],

    // rules for hard spaces

    space: [

      [/  /g, " "],

      [/ (a|i|o|u|s|z|k|v|A|I|O|U|S|Z|K|V) /g, " $1\u00a0"],

      [/(\d+)( )(\w|%)/g, "$1"+"\u00a0"+"$3"],

      [/(\d+\.)( )(\w)/g, "$1"+"\u00a0"+"$3"],

      [/([§|#])( )(\d)/g, "$1"+"\u00a0"+"$3"],

      [/(tj|tzv|tzn)\. /g, "$1.\u00a0"]

    ],

    // rules for dates

    date: [

      [/(\d{1,2}\.)(\d{1,2}\.)(\d{4})/g, "$1"+"\u00a0"+"$2"+" "+"$3"]

    ],

    // rule for ellipsis instead of 3 dots

    elipse: [

      [/\.{3}/g, "…"]

    ],


};

for (let i=0, max=all.length; i < max; i++)
{
	element =  all[i];
	if (shouldSkip(element)){continue;}
  // setImprovedTypografy(element);
console.log("Teď běží " + all[i].tagName)
	main(all[i]);

}

function shouldSkip(node)
{

  if (ignoredElemenents.includes(node.tagName) || node.textContent === "") {return true;}
  let sibs = getSiblings(node.childNodes[0]);

  for (let i=0, max=sibs.length;   i < max; i++)
  {

    if (sibs[i].nodeType === 3 && sibs[i].nodeValue !== null && sibs[i].textContent.trim() !== "") {return false;}
  }

  return true;

}

function main(element)
{

  let sibs = getSiblings(element);

    let childs = getSiblings(element.childNodes[0]);
    for (let i=0, max=childs.length;   i < max; i++)
    {
    //   // if (sibs[i].nodeType === 3)
    //   // {

    //   //   if (sibs[i].nextSibling === null){setImprovedTypografy(sibs[i]);return;}
    //     // if (sibs[i].nextSibling.nodeType === 3){setImprovedTypografy(sibs[i]);return;}
    if (childs[i].nodeType === 3) {setImprovedTypografy(element.childNodes[i]);}
        // textJoining(sibs[i]);
    //     // let textOfFirtstElement = sibs[i].textContent;


    //     // setImprovedTypografy(sibs[i]);
    //     // console.log(sibs[i].tagName);

    //   // }

    }

  textJoining(element);


}
//  var neco = document.getElementById("neco");

// console.log(neco.nodeValue);

//  if (neco.hasChildNodes) {console.log("Má")}
//  var neco2 = neco.nextSibling;
// console.log(neco.childNodes[4].textContent.trim());

 // console.log(neco4.nodeType);
 // if (neco.hasChildNodes) { console.log("má dítě");}
// getAllSiblings(neco);

function getSiblings(element)
{

  let sibs = [];
  sibs.push(element);
  while (element = element.nextSibling)
  {

      sibs.push(element);

  } 
  return sibs;

}
 function textJoining(node)
 {

  if (getElementWithText(node) === null) {console.log("Poslaný element " + node.tagName + " je null");return;}

  if (!node.hasChildNodes || node.childNodes[0].nextSibling === null ){console.log("Soused elementu " + node.tagName + " je null");setImprovedTypografy(node); return;}

  const elements = getElementWithText(node);
  let text = "";

  for (let i = 0; i < elements.length; i++) {

    text = text.concat(elements[i].textContent);
    text = text.concat(usellesChar);

  }

  text = improveTypography(text);
  const textField = text.split(usellesChar, elements.length);
  console.log(text);

  for (let i = 0; i < textField.length; i++) {

    elements[i].textContent = textField[i];

  }


  // let nextElement = getElementWithText(firstElement.nextSibling);

  // let text =  firstElement.textContent.concat(usellesChar);
  // text = text.concat(nextElement.textContent);

  // console.log(text);

  // text = improveTypography(text);
  // const textField = text.split("\u035B", 2);

  // firstElement.textContent = textField[0];
  // nextElement.textContent = textField[1];

  console.log("Script se vykonal celý");

  return;

 }

 function getElementWithText(node)
 {

  if (node.nodeType === 3){const element = node; return element}
  if (node.nodeType === 1){const element = getText(node); return element}

  return null;

 }

 function getText(node)
 {

    const sibs = getSiblings(node.childNodes[0]);
    let sibsWithText = [];

    for (let i=0, maxi=sibs.length; i < maxi; i++)
    {
      if (sibs[i].nodeType === 3){sibsWithText.push(sibs[i]);}
      if (sibs[i].hasChildNodes && inLineElements.includes(sibs[i].tagName))
      { 

        for (let x=0, max=sibs[i].childElementCount; x <= max; x++)
        {
          if (sibs[i].childNodes[x].nodeType === 3){sibsWithText.push(sibs[i]);}
        }

      }
  
    }

    return sibsWithText;
 
 }

function findInLineElemets(node)
{
	if (!node.hasChildNodes() || !inLineElements.includes(node.tagName) || node.nextSibling === null){return;}
	setImprovedTypografy(node.nextSibling);
	return;

}

function setImprovedTypografy(element)
{
	element.textContent = improveTypography(element.textContent);
	// element.textContent = "ahoj";
	return;
}

function improveTypography(string){


 //  for(let rule of Rules.quote)
 //  {

	// string = string.replace(rule[0], rule[1]);

 //  }

 //  for(let rule of Rules.units)
 //  {

 //    string = string.replace(rule[0], rule[1]);

 //  }

  for(let rule of Rules.number)
  {

    string = string.replace(rule[0], rule[1]);

  }

  // for(let rule of Rules.space)
  // {

  //   string = string.replace(rule[0], rule[1]);

  // }

  // for(let rule of Rules.date)
  // {

  //   string = string.replace(rule[0], rule[1]);

  // }


  // for(let rule of Rules.elipse)
  // {

  //   string = string.replace(rule[0], rule[1]);

  // }

  return string;

}