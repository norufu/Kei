import React, { useEffect, useRef, useState } from 'react';
import './March.css';


//[{date: __, hours: __}, {}]
function March({data, dataHandler} : {data:any, dataHandler:Function}) {
  const thisDiv = useRef<HTMLDivElement>(null);

  const [marchAverage, setMarchAverage] = useState(0.5);
  const [marchDay, setMarchDay] = useState(0);

  const [marchData, setMarchData] = useState<any[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState((new Date()).toISOString().substring(0, 10));


  useEffect(() => {
    let tempData = []

    let avg = 0;
    for(let i = 0; i < 16; i++) { //generate some fake data
      let date = new Date(2023, 0, i);
      let v = (Math.random() * 3).toFixed(3);
      avg += parseFloat(v);
      tempData.push({date: date, hours: v});
    }


    //fill in gaps up to today of 
    let today = new Date();
    let lastDay = tempData[tempData.length - 1].date;

    let difInDays = getDifferenceDays(today, lastDay);

    for(let i = 1; i < difInDays + 1; i ++) {
      let tempDay = new Date(lastDay);
      tempDay.setDate(tempDay.getDate() + i)
      tempData.push({date: tempDay, hours: 0})
    }

    console.log(tempData.length)
    setMarchData(tempData);
    setMarchAverage(parseFloat((avg/tempData.length).toFixed(3)));
    setMarchDay(0);

    setSelectedDateIndex(tempData.length);
  },[]);


  useEffect(() => { //recalc average when data is changed
    let total = 0;
    for(let i = 0; i < marchData.length; i ++) { 
      total+= parseFloat(marchData[i].hours);
    }
    setMarchAverage(parseFloat((total/marchData.length).toFixed(3)));
  }, [marchData]);

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

  function fillInGaps(selectedDate: Date, hour="0") {
    let updated = [...marchData];
    let difInDays;
    let setHour = "0";
    if(selectedDate < marchData[0].date) { //If the date is before any logged dates, fill backwards
      difInDays = Math.abs(getDifferenceDays(selectedDate, marchData[0].date));
      for(let i = 1; i < difInDays + 2; i ++) {
        let tempDay = new Date(marchData[0].date);
        tempDay.setDate(tempDay.getDate() - i)
        if(checkIfSameDay(tempDay, selectedDate))
          setHour = hour;
          setMarchDay(parseInt(hour));
        updated.unshift({date: tempDay, hours: setHour})
      }
    }
    else if (selectedDate > marchData[marchData.length - 1].date) { //If date is after any logged dates, fill forwards
      difInDays = getDifferenceDays(selectedDate, marchData[marchData.length - 1].date);
      for(let i = 1; i < difInDays + 1; i ++) {
        let tempDay = new Date(marchData[marchData.length - 1].date);
        tempDay.setDate(tempDay.getDate() + i)
        if(checkIfSameDay(tempDay, selectedDate))
          setHour = hour;
          setMarchDay(parseInt(hour));
        updated.push({date: tempDay, hours: setHour})
      }
    }
    else //if the date is some weird exception, return without changes
      return;

    //update
    setMarchData(updated);
  }

  function dateIsLogged(date: string) { //check if the date has been logged already
    for(let i = 0; i < marchData.length; i++) {
      if(marchData[i].date.toISOString().substring(0, 10) === date)
        return(true);
    }
    return(false);
  }

  function adjustTimezone(date: Date) { //return current date based on timezone
    var offset = new Date().getTimezoneOffset();
    offset = offset * 60 * 1000;
    var curDate = new Date(new Date().setTime(date.getTime() + offset));
    return(curDate);
  }

  function changeDate(e: React.FormEvent<HTMLInputElement>) {
    //Should be an easy way to check if date is in range, then select the right index. lazy solution for now
    let newD = e.currentTarget.value;
    let newDisplayNum = -1;
    let newDateIndex = 0;

    for(let i = 0; i < marchData.length; i ++) { //check if selected date has any hours logged
      if(newD === (marchData[i].date).toISOString().substring(0, 10)) {
        newDisplayNum = marchData[i].hours;
        newDateIndex = i;
        break;
      }
    }

    newDisplayNum == -1 ? newDisplayNum = 0 : newDisplayNum = newDisplayNum; //if there wasn't a log, display 0
    setSelectedDateIndex(newDateIndex);
    setSelectedDate(newD);
    setMarchDay(newDisplayNum);
  }

  function changeHour(e: React.FormEvent<HTMLInputElement>) { // fix it
    let newH = e.currentTarget.value;
    console.log(newH);
    console.log(dateIsLogged(selectedDate))
    if(dateIsLogged(selectedDate)) { //should do this in setstate probably
      let updated = [...marchData];
      updated[selectedDateIndex] = {date: marchData[selectedDateIndex].date, hours: newH};
      setMarchData(updated);
      console.log(newH)
      setMarchDay(parseFloat(newH));
    }
    else {
      console.log(selectedDate);
      console.log(new Date(selectedDate)); //NEED TO FIX THIS TIMEZONE ISSUE
      console.log(console.log(Intl.DateTimeFormat().resolvedOptions().timeZone))
      fillInGaps(adjustTimezone(new Date(selectedDate)), newH);
    }

  }


  return (
    <div ref={thisDiv} className="march">
        <h1>Average: {marchAverage}</h1>
        <h1>Today: {marchDay}</h1>

        <div id="marchInputs">
            <input onChange={changeDate} type="date" value={selectedDate}></input>
            <input onChange={changeHour} className="hourInput" type="number" min="0" max="24" value={marchDay}></input>
        </div>

    </div>
  );
}

export default March;
