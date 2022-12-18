<template>
    <div class="jumbotron vertical-center">
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    <h1>Recipes</h1>
                    <hr />
                    <br />
                    <!-- Alert Message -->
                    <b-alert v-if="showMessage" variant="success" show>{{
                            message
                    }}</b-alert>
                    <!-- b-alert v-if="error" variant="danger" show>{{ error }}</b-alert-->

                    <button type="button" class="btn btn-success btn-sm" v-b-modal.recipe-modal>
                        Create Recipe
                    </button>
                    <br /><br />
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Ingredients</th>
                                <th scope="col">Steps</th>
                                <th scope="col">Rating</th>
                                <th scope="col">Favorite</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="recipe in recipes" :key="recipe.id">
                                <td>{{ recipe.name }}</td>
                                <td>{{ recipe.ingredients }}</td>
                                <td>{{ recipe.steps }}</td>
                                <td>{{ recipe.rating }}</td>
                    
                                <td>
                                    <span 
                                    v-if="recipe.favorite" class="badge badge-success">Favorite</span>
                                    <span v-else class="badge badge-danger">Not Favorite</span>
                                </td>
                                <td>
                                    <div class="btn-group" role="group">
                                        <button type="button" class="btn btn-info btn-sm" v-b-modal.edit-recipe-modal
                                            @click="editRecipe(recipe)">
                                            Edit
                                        </button>
                                        <button type="button" class="btn btn-danger btn-sm"
                                            @click="deleteRecipe(recipe)">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <footer class="text-center">
                        Copyright &copy; All Rights Reserved.
                    </footer>
                </div>
            </div>
            <b-modal ref="addRecipeModal" id="recipe-modal" title="Create a new recipe" hide-backdrop hide-footer>
                <b-form @submit="onSubmit" class="w-100">
                    <b-form-group id="form-name-group" label="Recipe Name:" label-for="form-name-input">
                        <b-form-input id="form-name-input" type="text" v-model="createRecipeForm.name"
                            placeholder="Recipe Name" required>
                        </b-form-input>
                </b-form-group>
                <b-form-group id="form-ingredients-group" label="Ingredients:" label-for="form-ingredients-input">
                        <b-form-textarea id="form-ingredients-input" v-model="createRecipeForm.ingredients" placeholder="Enter ingredients for your recipe..."
                            rows="3" max-rows="6">
                        </b-form-textarea>
                </b-form-group>
                <b-form-group id="form-steps-group" label="Steps:" label-for="form-steps-input">
                    <b-form-textarea id="form-steps-input" v-model="createRecipeForm.steps" placeholder="Enter steps for your recipe..." rows="3" max-rows="6"></b-form-textarea>
                </b-form-group>
                <b-form-group id="form-rating-group" label="Rating:" label-for="form-rating-input">
                    <b-form-input id="form-rating-input" type="number" min="1" max="5" v-model="createRecipeForm.rating" placeholder="0"
                        required>
                    </b-form-input>
                </b-form-group>
                <b-form-group id="form-favorite-group"  label-for="form-favorite-input" label="Favorite">
                    <b-form-checkbox
                        id="checkbox-favorite" 
                        v-model= "createRecipeForm.favorite"
                        name="checkbox-favorite"
                        value="true"
                        >
                    </b-form-checkbox>
                        
                </b-form-group>

                    <b-button type="submit" variant="outline-info">Submit</b-button>
                </b-form>
            </b-modal>
            <!-- End of Modal for Create Recipe
            v-model="createRecipeForm.favorite"-->
            <!-- Start of Modal for Edit Recipe-->
            <b-modal ref="editRecipeModal" id="edit-recipe-modal" title="Edit the Recipe" hide-backdrop hide-footer>
                <b-form @submit="onSubmitUpdate" class="w-100">
                    <b-form-group id="form-edit-name-group" label="Recipe Name:" label-for="form-edit-name-input">
                        <b-form-input id="form-edit-name-input" type="text" v-model="editRecipeForm.name"
                            placeholder="Recipe Name" required>
                        </b-form-input>
                    </b-form-group>
                <b-form-group id="form-edit-ingredients-group" label="Ingredients:" label-for="form-edit-ingredients-input">
                    <b-form-textarea id="form-edit-ingredients-input" v-model="editRecipeForm.ingredients"
                        placeholder="Enter ingredients for your recipe..." rows="3" max-rows="6">
                    </b-form-textarea>
                </b-form-group>
                <b-form-group id="form-edit-steps-group" label="Steps:" label-for="form-edit-steps-input">
                    <b-form-textarea id="form-edit-steps-input" v-model="editRecipeForm.steps" placeholder="Enter steps for your recipe..."
                        rows="3" max-rows="6"></b-form-textarea>
                </b-form-group>
                <b-form-group id="form-edit-rating-group" label="Rating:" label-for="form-edit-rating-input">
                    <b-form-input id="form-edit-rating-input" type="number" min="1" max="5" v-model="editRecipeForm.rating" placeholder="0"
                        required>
                    </b-form-input>
                </b-form-group>
                <b-form-group id="form-edit-favorite-group" label-for="form-edit-favorite-input" label="Favorite">
                    <b-form-checkbox id="checkbox-edit-favorite" v-model="editRecipeForm.favorite" name="checkbox-edit-favorite"
                        value="true">
                    </b-form-checkbox>
                </b-form-group>
                <b-button type="submit" variant="outline-info">Update</b-button>
                    </b-form>
            </b-modal>
            <!-- End of Modal for Edit Recipes-->
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "Recipes",
    data() {
        return {
            recipes: [],
            createRecipeForm: {
                name: "",
                ingredients: "",
                steps: "",
                rating: "",
                favorite: [],
            },
            editRecipeForm: {
                id: "",
                name: "",
                ingredients: "",
                steps: "",
                rating: "",
                favorite: [],
            },
            showMessage: false,
            message: "",
        };
    },
    methods: {
        /***************************************************
         * RESTful requests
         ***************************************************/
        //GET function
        RESTgetRecipe() {
            //const path = `http://localhost:5000/recipes`;
            const path = `${process.env.VUE_APP_ROOT_URL}/recipes`;
            axios
                .get(path)
                .then((response) => {
                    this.recipes = response.data.recipes;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        // POST function
        RESTcreateRecipe(payload) {
            //const path = `http://localhost:5000/recipes`;
            const path = `${process.env.VUE_APP_ROOT_URL}/recipes`;
            axios
                .post(path, payload)
                .then((response) => {
                    this.RESTgetRecipe();
                    // For message alert
                    this.message = "Recipe Created successfully!";
                    // To actually show the message
                    this.showMessage = true;
                    // To hide the message after 3 seconds
                    setTimeout(() => {
                        this.showMessage = false;
                    }, 3000);
                })
                .catch((error) => {
                    console.error(error);
                    this.RESTgetRecipe();
                });
        },
        // Update function
        RESTupdateRecipe(payload_edit, recipeId) {
            //const path = `http://localhost:5000/recipes/${recipeId}`;
            const path = `${process.env.VUE_APP_ROOT_URL}/recipes/${recipeId}`;
            axios
                .put(path, payload_edit)
                .then((response) => {
                    this.RESTgetRecipe();
                    // For message alert
                    this.message = "Recipe Updated successfully!";
                    // To actually show the message
                    this.showMessage = true;
                    // To hide the message after 3 seconds
                    setTimeout(() => {
                        this.showMessage = false;
                    }, 3000);
                })
                .catch((error) => {
                    console.error(error);
                    this.RESTgetRecipe();
                });
        },
        // Delete recipe
        RESTdeleteRecipe(recipeId) {
            //const path = `http://localhost:5000/recipes/${recipeId}`;
            const path = `${process.env.VUE_APP_ROOT_URL}/recipes/${recipeId}`;
            axios
                .delete(path)
                .then((response) => {
                    this.RESTgetRecipe();
                    // For message alert
                    this.message = "Recipe Deleted successfully!";
                    // To actually show the message
                    this.showMessage = true;
                    // To hide the message after 3 seconds
                    setTimeout(() => {
                        this.showMessage = false;
                    }, 3000);
                })
                .catch((error) => {
                    console.error(error);
                    this.RESTgetRecipe();
                });
        },
        /***************************************************
         * FORM MANAGEMENT
         * *************************************************/
        // Initialize forms empty
        initForm() {
            this.createRecipeForm.name = "";
            this.createRecipeForm.ingredients = "";
            this.createRecipeForm.steps = "";
            this.createRecipeForm.rating = "";
            this.createRecipeForm.favorite = [];
            this.editRecipeForm.id = "";
            this.editRecipeForm.name = "";
            this.editRecipeForm.ingredients = "";
            this.editRecipeForm.steps = "";
            this.editRecipeForm.rating = "";
            this.editRecipeForm.favorite = [];
        },
        // Handle submit event for create recipe
        onSubmit(e) {
            e.preventDefault(); //prevent default form submit form the browser
            this.$refs.addRecipeModal.hide();
            let favorite = false;
            if (this.createRecipeForm.favorite[0]) favorite = true;
             //hide the modal when submitted
            const payload = {
                name: this.createRecipeForm.name,
                ingredients: this.createRecipeForm.ingredients,
                steps: this.createRecipeForm.steps,
                rating: this.createRecipeForm.rating,
                favorite,
                
            };
            this.RESTcreateRecipe(payload);
            this.initForm();
        },
        // Handle submit event for edit recipe
        onSubmitUpdate(e) {
            e.preventDefault(); //prevent default form submit form the browser
            this.$refs.editRecipeModal.hide(); //hide the modal when submitted
            let favorite = false;
            if (this.editRecipeForm.favorite[0]) favorite = true;
            const payload_edit = {
                name: this.editRecipeForm.name,
                ingredients: this.editRecipeForm.ingredients,
                steps: this.editRecipeForm.steps,
                rating: this.editRecipeForm.rating,
                favorite,
            };
            this.RESTupdateRecipe(payload_edit, this.editRecipeForm.id);
            this.initForm();
        },
        // Handle edit button
        editRecipe(recipe) {
            this.editRecipeForm = recipe;
            //this.editRecipeForm.name = recipe.name;
            //this.editRecipeForm.id = recipe.id;
            //this.editRecipeForm.ingredients = recipe.ingredients;
            //this.editRecipeForm.steps = recipe.steps;
            //this.editRecipeForm.rating = recipe.rating;
            //this.editRecipeForm.favorite = recipe.favorite;
        },
        // Handle Delete button
        deleteRecipe(recipe) {
            this.RESTdeleteRecipe(recipe.id);
        },
    },
    /***************************************************
     * LIFECYClE HOOKS
     ***************************************************/
    created() {
        this.RESTgetRecipe();
    },
};
</script>