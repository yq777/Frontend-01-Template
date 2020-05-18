function match(string) {
    let state = start;
    for (let c of string) {
      state = state(c);
    }
    return state === end;
  }
  
  function start(a) {
    if (a === 'a') {
      return foundA;
    } else {
      return start;
    }
  }
  function foundA(c) {
    if (c === 'b') {
      return foundA1;
    } else {
      return start(c);
    }
  }
  function foundA1(c) {
    if (c === 'a') {
      return foundB1;
    } else {
      return start(c);
    }
  }
  function foundB1(c) {
    if (c === 'b') {
      return foundA2;
    } else {
      return start(c);
    }
  }
  function foundA2(c) {
    if (c === 'a') {
      return foundB2;
    } else {
      return start(c);
    }
  }
  function foundB2(c) {
    if (c === 'b') {
      return foundX;
    } else {
      return start(c);
    }
  }
  function foundX(c) {
    if (c === 'x') {
      return end;
    } else {
      return foundA2(c);
    }
  }
 
  function end(c) {
    return end;
  }
  console.log(match("i an abababababababxxxxxxx"))