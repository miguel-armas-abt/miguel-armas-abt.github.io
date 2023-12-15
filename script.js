let isMenuVisible = false;
//Función que oculta o muestra el menu
function hideMenu(){
    if(isMenuVisible){
        document.getElementById("nav").classList ="";
        isMenuVisible = false;
    }else{
        document.getElementById("nav").classList ="responsive";
        isMenuVisible = true;
    }
}

function select(){
    document.getElementById("nav").classList = "";
    isMenuVisible = false;
}