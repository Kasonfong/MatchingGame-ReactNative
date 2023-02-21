import{ React, Component} from 'react'
import {
  StatusBar,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,

} from 'react-native'
import {Slider,renderTrackMarkComponent } from '@miblanchard/react-native-slider';
import Card from './Card'

class App extends Component{

    state = {
      cardFace:[
        'A','B','C','D','1','2','3','4',
      ],
      cardFacesInRand: [],
      isOpen: [],
      firstPickedIndex: null,
      secondPickedIndex: null,
      steps: 0,
      isEnded: false,

       //try myself
      refreshRate:3.5
      
    }

componentDidMount() {
  this.startGame()
}

startGame = () =>{
  let newCardsFace = [...this.state.cardFace, ...this.state.cardFace]
  let cardFacesInRand = this.shuffleCard(newCardsFace)


  let isOpen = []

  for (let i=0; i<newCardsFace.length;i++){
    isOpen.push(false)
  }


  this.setState({
    cardFacesInRand,
    isOpen
    })
}

shuffleCard = (array) => {

   let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;


}
/*
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

above array shuffling method is 
from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

*/

cardPressHandler = (index) =>{
  let isOpen = [...this.state.isOpen]

  if(isOpen[index]){
    return;
  }

  isOpen[index] = true

  
 

  if(this.state.firstPickedIndex == null && this.state.secondPickedIndex == null){
    this.setState({
      isOpen,
      firstPickedIndex : index
    })
  }
  else if(this.state.firstPickedIndex != null && this.state.secondPickedIndex == null){
    this.setState({
      isOpen,
      secondPickedIndex : index
    })
  }



}


matching = () =>{
  if(this.state.firstPickedIndex != null && this.state.secondPickedIndex != null){

      if(this.state.cardFace.length >0){

        let totalOpens = this.state.isOpen.filter((isOpen) =>isOpen)

        if( totalOpens.length === this.state.cardFacesInRand.length){
          this.setState({
            isEnded: true,
          })
          return
        }


      }
    


    let firstCard = this.state.cardFacesInRand[this.state.firstPickedIndex]
    let secondCard = this.state.cardFacesInRand[this.state.secondPickedIndex]


    if(firstCard != secondCard){
 //fail
      setTimeout(() => {

        let isOpen = [...this.state.isOpen]
        isOpen[this.state.firstPickedIndex] = false
        isOpen[this.state.secondPickedIndex] = false

        this.setState({
          
          firstPickedIndex: null,
          secondPickedIndex: null,
          isOpen,
        })

      },this.state.refreshRate*1000)
     
     

    }
    else{
      //success
        this.setState({
          firstPickedIndex: null,
          secondPickedIndex: null,
        })

    }

    this.setState({
      steps:this.state.steps +1
    })
  }



}

resetGame = () =>{
  this.startGame()
  this.setState({
    firstPickedIndex: null,
    secondPickedIndex: null,
    steps: 0,
    isEnded: false,

  })
}

componentDidUpdate(prevProps,prevState){
  if(prevState.secondPickedIndex != this.state.secondPickedIndex){
    this.matching()
  }
  
  if(prevState.refreshRate != this.state.refreshRate && this.state.isEnded !=true){
    this.resetGame()
  }
}


  render(){
    return( 
    <> 

      <StatusBar />

      <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.heading}>Matching Game</Text>

          </View>
          <View style={styles.main}>
                  <View style={styles.slider}>
                <Slider
                    value={this.state.refreshRate}
                    maximumValue={3.5} minimumValue={0.5} step={1}
                    onValueChange={refreshRate => this.setState({refreshRate})}
                />
                <Text style={styles.sliderText}>Refresh Rate: {this.state.refreshRate}/s</Text>
                {this.state.refreshRate==3.5
                ?
                <Text style={styles.sliderText}>Easy </Text>
                :
                null
              }
                {this.state.refreshRate==2.5
                ?
                <Text style={styles.sliderText}>Medium </Text>
                :
                null
              }
                {this.state.refreshRate==1.5
                ?
                <Text style={styles.sliderText}>Hard </Text>
                :
                null
              }
                {this.state.refreshRate==0.5
                ?
                <Text style={styles.sliderText}>Very Hard </Text>
                :
                null
              }
                

            </View>
        
            <View style={styles.gameBoard}>

            {this.state.cardFacesInRand.map((card,index) =>
            <Card key={index} onPress={() => this.cardPressHandler(index)} style={styles.button} fontSize={30} title={card} cover='?' isShow={this.state.isOpen[index]}/>
            
            )}
              

              
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
                {
                  this.state.isEnded ?
                  `Game Clear! Finished with ${this.state.steps} steps taken \n` 
                  :
                  `${this.state.steps} steps taken`
                }
              
            </Text>
          
                {this.state.isEnded ?
                  <TouchableOpacity onPress={this.resetGame} style = {styles.playAgainButtion}>
                  <Text style={styles.playAgainButtionText}> Play Again</Text>
                  </TouchableOpacity>
                :null
                }

          </View>


      </SafeAreaView>


    </>
    
    )
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex:1,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading:{
    fontSize:45,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  main: {
    flex:3,
    backgroundColor: '#87cefa',
  },
  
   footer: {
      flex:1,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText:{

    fontSize:15,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  gameBoard: {
    flex:1,
    flexDirection:'row',
    flexWrap: 'wrap',
    justifyContent:'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  button:{
    backgroundColor:"white",
    borderRadius: 30,
    width:50,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    margin:((Dimensions.get('window').width-50*4))/(5*2),
  },
  buttonText:{
    color:'black',
    fontSize:30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playAgainButtion:{
    backgroundColor:"red",
    borderRadius: 30,
    width:170,
    height:50,
    justifyContent:'center',
    alignItems:'center',
  },
  playAgainButtionText:{
    color:'white',
    fontSize:30,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  slider: {
    flex: 0.3,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
},
sliderText:{
  color:'black',
  fontSize:30,
  fontWeight: 'bold',
  textAlign: 'center',
}

})