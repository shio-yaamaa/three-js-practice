class Constellation(value=null) {
  constructor(value, isRootStar) {
    if (!value) { // This is the rootStar (the MaMuka)
      
    }
    
    this.value = value;
    this.childStars = [];
    this.parentStar = null;
  }
  
  addStar(value) {
    if (this.childStars.length < 3) {
      this.childStars.push(new Constellation(value));
    }
  }
  
  removeStar() {
    
  }
  
  isConstellation() {
    
  }
  
  isStar() { // Return if it's the last node of constellation
    return this.childStars.length === 0;
  }
}