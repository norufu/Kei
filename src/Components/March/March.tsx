import React, { useEffect, useRef, useState } from 'react';
import './March.css';


function March({data, dataHandler} : {data:any, dataHandler:Function}) {
  const thisDiv = useRef<HTMLDivElement>(null);

  const [marchAverage, setMarchAverage] = useState(0);
  const [marchHours, setMarchHours] = useState(0);

  const [marchData, setMarchData] = useState<any[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(-1);
  const [selectedDateString, setSelectedDateString] = useState(formatDate(new Date()));
  const [selectedDateObject, setSelectedDateObject] = useState(new Date());

  useEffect(() => {
    let today = new Date();

    if(!data || Object.keys(data).length === 0) { //create a blank for today
      setMarchData([{date: new Date(), hours: 0}])
      setSelectedDateIndex(0);
      setSelectedDateObject(today);
      setSelectedDateString(formatDate(today));
      setMarchHours(0);
    }
    else { //fill in gaps and populate everything
      //remap all the data to date objects
      var remappedData = data.days.map(function(item: any) {
        return {date: new Date(item.date), hours: item.hours};
      });

      var dateIndex = -1;
      //check if today is included and set selected index
      if(today > remappedData[remappedData.length - 1].date) {
        let difInDays = getDifferenceDays(today, remappedData[remappedData.length - 1].date);
        for(let i = 1; i < difInDays + 2; i ++) {
          let tempDay = new Date(remappedData[remappedData.length - 1].date);
          tempDay.setDate(tempDay.getDate() + i)
          remappedData.push({date: tempDay, hours: '0'})
        }
        dateIndex = remappedData.length - 1;
      }
      else {
        for(let i = 0; i < remappedData.length; i++) {
          if(checkIfSameDay(today, remappedData[i].date)) {
            dateIndex = i;
          }
        }
      }

      setSelectedDateIndex(dateIndex);
      setMarchData(remappedData);
      setMarchHours(remappedData[dateIndex].hours);
      setSelectedDateObject(today);
      setSelectedDateString(formatDate(today));
    }
  }, []);


  useEffect(() => { //recalc average when data is changed
    let total = 0;
    for(let i = 0; i < marchData.length; i ++) { 
      total+= parseFloat(marchData[i].hours);
    }
    setMarchAverage(parseFloat((total/marchData.length).toFixed(3)));
    
    dataHandler({days: marchData});

  }, [marchData]);

  useEffect(() => {
    setSelectedDateObject(selectedToDateObject(selectedDateString));
  }, [selectedDateString])

  function getDifferenceDays(d1: Date, d2: Date) {
    var Difference_In_Time = d1.getTime() - d2.getTime();
    var Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));
    return(Difference_In_Days)
  }

  function checkIfSameDay(d1: Date, d2:Date) {
    if(d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()) {
      return(true)
    }
    return(false);
  }

  function fillInGaps(selDate: Date, hour="0") {
    console.log('fillin')
    let updated = [...marchData];
    let difInDays;
    let setHour = "0";
    console.log(marchData)
    console.log(selDate, marchData[marchData.length - 1].date)
    if(selDate < marchData[0].date) { //If the date is before any logged dates, fill backwards
      difInDays = Math.abs(getDifferenceDays(selDate, marchData[0].date));
      for(let i = 1; i < difInDays; i ++) {
        let tempDay = new Date(marchData[0].date);
        tempDay.setDate(tempDay.getDate() - i)
        if(checkIfSameDay(tempDay, selDate))
          setHour = hour;
          setMarchHours(parseInt(hour));
        updated.unshift({date: tempDay, hours: setHour})
      }

      setSelectedDateIndex(0);
    }
    else if (selDate > marchData[marchData.length - 1].date) { //If date is after any logged dates, fill forwards
      difInDays = getDifferenceDays(selDate, marchData[marchData.length - 1].date);
      for(let i = 1; i < difInDays + 2; i ++) {
        let tempDay = new Date(marchData[marchData.length - 1].date);
        tempDay.setDate(tempDay.getDate() + i)
        if(checkIfSameDay(tempDay, selDate))
          setHour = hour;
          setMarchHours(parseInt(hour));
        updated.push({date: tempDay, hours: setHour})
      }
      
      setSelectedDateIndex(updated.length-1)
    }
    else //if the date is some weird exception, return without changes
    {
      console.log('exception')
      return;

    }
    //update
    console.log(updated);
    setMarchData(updated);
  }

  function dateIsLogged(date: string) { //check if the date has been logged already
    for(let i = 0; i < marchData.length; i++) {
      if(formatDate(marchData[i].date) === date)
        return(true);
    }
    return(false);
  }

  function formatDate(date: Date) { //get in ISO format without messing up timezones
    let y = String(date.getFullYear());
    let d = String(date.getDate());
    let m = String(date.getMonth() + 1); // adjust for jan being 0
    if(parseInt(m) < 10) {
      m = "0" + String(m);
    }
    return(y + "-" + m + "-" + d);
  }

  function selectedToDateObject(date: string) {
    var selectedAsDateObject = new Date(selectedDateString);
    selectedAsDateObject.setTime(selectedAsDateObject.getTime() + selectedAsDateObject.getTimezoneOffset() *60000)
    return(selectedAsDateObject);
  }

  function changeDate(e: React.FormEvent<HTMLInputElement>) {
    //Should be an easy way to check if date is in range, then select the right index. lazy solution for now
    let newD = e.currentTarget.value;
    let newDisplayNum = -1;
    let newDateIndex = 0;

    for(let i = 0; i < marchData.length; i ++) { //check if selected date has any hours logged
      if(newD === formatDate(marchData[i].date)) {
        newDisplayNum = marchData[i].hours;
        newDateIndex = i;
        break;
      }
    }

    newDisplayNum == -1 ? newDisplayNum = 0 : newDisplayNum = newDisplayNum; //if there wasn't a log, display 0
    setSelectedDateIndex(newDateIndex);
    setSelectedDateString(newD);
    
    setMarchHours(newDisplayNum);
  }

  function changeHour(e: React.FormEvent<HTMLInputElement>) { // fix it
    console.log(dateIsLogged(selectedDateString))
    let newH = e.currentTarget.value;

    //check if date is already existing, else fill in gaps to that date
    if(dateIsLogged(selectedDateString)) { //should do this in setstate probably
      let updated = [...marchData];
      console.log(selectedDateIndex)
      updated[selectedDateIndex] = {date: marchData[selectedDateIndex].date, hours: newH}; //update hours for that date
      setMarchData(updated);
      setMarchHours(parseFloat(newH));
    }
    else {
      //turn the selected date into a date
      fillInGaps(selectedDateObject, newH);
    }
  }


  return (
    <div ref={thisDiv} className="march">
        <h1>Average: {marchAverage}</h1>
        <h1>Today: {marchHours}</h1>

        <div id="marchInputs">
            <input onChange={changeDate} type="date" value={selectedDateString}></input>
            <input onChange={changeHour} className="hourInput" type="number" min="0" max="24" value={marchHours}></input>
        </div>

    </div>
  );
}

export default March;
