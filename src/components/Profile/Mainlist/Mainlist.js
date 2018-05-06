import React, { Component } from 'react';


class Mainlist extends Component {
    constructor(){
        super();
        this.state={
            list:["ana", "kelthuzad", "garrosh", "stukov","malthael","dva", "genji","cassia","probius","lucio","valeera","ragnaros","varian","samuro","zarya","alarak","auriel","guldan","medivh","chromie","tracer", "dehaka","xul", "liming","greymane","lunara","cho","gall","artanis","ltmorales","rexxar","kharazim","leoric","butcher","johanna","kaelthas","sylvanas","thelostvikings","thrall","jaina","anubarak","azmodan","chen","rehgar","zagara","murky","brightwing","lili","tychus","diablo","zeratul","illidan","raynor","tassadar","uther","sgthammer","nazeebo","malfurion","kerrigan","tyrael","sonya", "valla","etc","gazlowe","tyrande","nova","abathur","muradin","stitches","arthas","falstad"],
            filteredList:["ana", "kelthuzad", "garrosh", "stukov","malthael","dva", "genji","cassia","probius","lucio","valeera","ragnaros","varian","samuro","zarya","alarak","auriel","guldan","medivh","chromie","tracer", "dehaka","xul", "liming","greymane","lunara","cho","gall","artanis","ltmorales","rexxar","kharazim","leoric","butcher","johanna","kaelthas","sylvanas","thelostvikings","thrall","jaina","anubarak","azmodan","chen","rehgar","zagara","murky","brightwing","lili","tychus","diablo","zeratul","illidan","raynor","tassadar","uther","sgthammer","nazeebo","malfurion","kerrigan","tyrael","sonya", "valla","etc","gazlowe","tyrande","nova","abathur","muradin","stitches","arthas","falstad"],
            hero:''
        }
    }
filterFunction(e){
    
    let temp=this.state.list.sort().filter(word=>word.split('').slice(0,e.split('').length).join('')==e)
    this.setState({filteredList: temp})
}
handleName(e){
    console.log(e)
     this.props.getHero(`http://s3.hotsapi.net/img/heroes/92x93/${e}.png`)
}

  render() {
      let filtered= this.state.filteredList.sort().map((name,i)=>{
          let heroName=name.charAt(0).toUpperCase()+name.slice(1);
          return (<option key={i} type="text"  value={name} >{heroName}
          </option>);
      })
    return (
      <div className="Nav">

        <p>Choose your main:</p>
        <input placeholder='hero name'  type='text' onChange={e=>this.filterFunction(e.target.value)}/>
        <select onBlur={e=> this.handleName(e.target.value)}>
          {filtered}
        </select> 
        <button onClick={()=>this.props.saveChanges(this.state.filteredList)}> Save </button>
      </div>
    );
  }
}

export default Mainlist;


