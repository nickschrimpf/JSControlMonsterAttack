const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;


const ATTACK = 0;
const STRONG_ATTACK = 1;
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

let chosenMaxLife;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];

function getMaxLifeValues(){
    const enteredValue = prompt('Maximum life for you and your monster.','100')
    let parsedValue = parseInt(enteredValue);
    if( isNaN(parsedValue) || parsedValue < 0){
        throw {message:'Invalid user input not a number'}
    }
    return parsedValue
}
    try {
        let chosenMaxLife = getMaxLifeValues()
    } catch (error){
        alert(error.message.concat(' default value will be 100'));
        chosenMaxLife = 100;
    }finally{
        // we could log errors in our own server or something else here
        // clean up data etc...
    }



adjustHealthBars(chosenMaxLife)

function writeToLog(event,value, monsterHealth,playerHeath){
    let logEntry ={
        event:event,
        value:value,
        finalMonsterHealth:monsterHealth,
        finalPlayerHealth:playerHeath
    };
    switch(event){
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER';
            break;
    }

    // if (event === LOG_EVENT_PLAYER_ATTACK){
    //     logEntry.target = 'MONSTER';
        
    // } else if (event === LOG_EVENT_MONSTER_ATTACK){
    //     logEntry.target = 'PLAYER';
        
    // }else if (event === LOG_EVENT_PLAYER_HEAL){
    //     logEntry.target = 'PLAYER';
    // }

    battleLog.push(logEntry);
}

function resetAfterGame(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife)
}

function endRound(){
    const initialPlayerHealth = currentPlayerHealth
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE)
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK,playerDamage,currentMonsterHealth,currentPlayerHealth)

    if(currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth)
        alert('Your extra life has saved you')
    }
    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0){
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
        )
        alert('you won')
    }else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0){
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
        )
        alert('you lost')
    }else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0 ){
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'DRAW',
            currentMonsterHealth,
            currentPlayerHealth
        )
        alert('we have a draw')
    }

    if(currentMonsterHealth <=0 || currentPlayerHealth <=0){
            resetAfterGame(chosenMaxLife)
    }
}

function attackMonster(type){
    let maxDamage = type === 0 ? ATTACK_VALUE:STRONG_ATTACK_VALUE;
    let eventType = type === 0 ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK

     
    // if(type === 0){
    //     maxDamage = ATTACK_VALUE;
    //     writeToLog(
    //         LOG_EVENT_PLAYER_ATTACK,
    //         maxDamage,
    //         currentMonsterHealth,
    //         currentPlayerHealth
    //     )
    // }else {
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     writeToLog(
    //         LOG_EVENT_PLAYER_STRONG_ATTACK,
    //         maxDamage,
    //         currentMonsterHealth,
    //         currentPlayerHealth
    //     )
    // }

    const damage = dealMonsterDamage(ATTACK_VALUE)
    currentMonsterHealth -= damage;
    writeToLog(
        eventType,
        damage,
        currentMonsterHealth,
        currentPlayerHealth
    )
    
    endRound()
}


function healPlayerHandler(){
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert("You can't heal to more than you max initial health.")
        healValue = chosenMaxLife - currentPlayerHealth;
    }else {
        healValue = HEAL_VALUE
    }
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    )
    increasePlayerHealth(healValue)
    currentPlayerHealth += healValue;
    endRound()
}

function attackHandler(){
  attackMonster(ATTACK)
}
function strongAttackHandler(){
    attackMonster(STRONG_ATTACK)
}
 function printLogHandler(){
     for(let i = 0; i < battleLog.length;i++){
        console.log(battleLog[i])
     }
     console.log(battleLog)
 }
attackBtn.addEventListener('click',attackHandler)
strongAttackBtn.addEventListener('click',strongAttackHandler)
healBtn.addEventListener('click',healPlayerHandler)
logBtn.addEventListener('click',printLogHandler)