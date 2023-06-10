    // Get all delete buttons
    const deleteButtons = document.querySelectorAll(".delete-medication");

    // Attach click event listeners to each delete button
    deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener("click", () => {
        // Get the medication ID from the data attribute
        const medicationId = deleteButton.dataset.medicationId;

        // Send the DELETE request using Axios
        axios({
          method: "DELETE",
          url: `/delete_medication_frontend/${medicationId}`,
        })
          .then((response) => {
            // Handle the success response
            alert("Deleted Successfully");
            window.location.reload(); // Refresh the page after successful deletion
          })
          .catch((error) => {
            // Handle the error response
            alert("Error: " + error.message);
          });
      });
    });