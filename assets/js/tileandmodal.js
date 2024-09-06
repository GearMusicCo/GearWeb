function removeFieldById(elIdStr) {
	if(!elIdStr || elIdStr == ""){
		return;
	}
	
	const element = document.getElementById(elIdStr);
    if (element) {
       element.remove();
	} else {
      console.log(`Element with ID "${elIdStr}" not found.`);
    }
}

function checkTileAndRemoveFields (removeFieldsStr){
	if (removeFieldsStr != null && removeFieldsStr.trim() !== '') {
		var fieldsArray = removeFieldsStr.split(',').map(function(value) {
			return value.trim(); // Remove any extra whitespace from each value
    	});
		fieldsArray.forEach(f => removeFieldById(f + "-container"));

	} 
}


function BindServiceTiles (){
    // Get modal element
    var modal = document.getElementById("contactModal");
    // Get close button
    var closeBtn = document.getElementsByClassName("close")[0];

    // Get all tiles
    var tiles = document.getElementsByClassName("tile");

    // Add click event listeners to each tile
    Array.from(tiles).forEach(function(tile) {
    tile.addEventListener("click", function() {
        //reset our dynamic form
        document.querySelector('#modalContactForm').outerHTML = originalFormHTML;

        //get the tile info that was clicked
        var service = this.getAttribute("data-service");
        var tileDesc = this.getElementsByClassName('tile-subtitle')[0].innerText;
        var tileName =  this.getElementsByClassName('tile-header')[0].innerText;
        var locPlaceholderToggle =  this.getAttribute("data-tileloc"); 
        var removeFields = this.getAttribute("data-removefields");

        // Update modal
        if (removeFields) { checkTileAndRemoveFields(removeFields); }
        if(locPlaceholderToggle) { document.getElementById("location").setAttribute("placeholder", locPlaceholderToggle); }
        document.getElementById("modalHeader").innerText = "Thank you for considering me for your " + service;
        document.getElementById("modalDescription").innerText = tileDesc;
        document.getElementById("modalSubject").value = `Submission from website - Inquiry about ${tileName}`; //this is for the email subj

        

        // Show the modal
        var modal = document.getElementById("contactModal");
        modal.style.display = "block";
    });
    });

    // Listen for close click
    closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
    });

    // Listen for outside click
    window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
     }
    });

}