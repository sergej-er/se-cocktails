function validateForm(e) {
  let cocktailImage = $("#cocktailImage");
  let cocktailName = $("#cocktailName");
  let cocktailIngredients = $("input[name='ingredients']");
  let cocktailRecipe = $("#cocktailRecipe");

  let inputs = [
    cocktailImage,
    cocktailName,
    cocktailIngredients,
    cocktailRecipe,
  ];
  inputs.forEach((input) => {
    if (input.length == 1) {
      checkRequired(input, e);
    } else {
      input.each((_, input) => {
        checkRequired($(input), e);
      });
    }
  });
}

function checkRequired(input, e) {
  inputValue = input.val() ? input.val() : input.html();
  if (!inputValue || inputValue.length === 0 || inputValue.trim() === "") {
    showError(input, "Darf nicht leer sein.");
    e.preventDefault();
  } else {
    showSuccess(input);
  }
}

function showError(input, message) {
  input.removeClass("success").addClass("error");
  input.next().html(message);
}

function showSuccess(input) {
  input.removeClass("error").addClass("success");
  $("#" + input.attr("id") + "Desc").addClass("hidden");
}

function fileSelected() {
  const file = $("#cocktailImage")[0].files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    $("#image").attr("src", url);
    $("#cocktailImage").attr("value", url);
  }
}

function addIngredientField() {
  let newInput = $("<input />", {
    type: "text",
    class:
      "shadow inline-block appearance-none rounded w-full mb-1 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline",
    name: "ingredients",
    placeholder: "z. B. Vodka",
    autocomplete: "off",
  }).insertBefore($(".ingredient-controls"));
  $("<span>", {
    class: "block text-pink-dark text-xs",
  }).insertAfter(newInput);
}

function deleteIngredientField() {
  let inputs = $('input[name="ingredients"]');
  let prevInput = inputs[inputs.length - 1];
  if (inputs.length > 1) {
    $(prevInput).remove();
  }
}
