// ==========================================
// PERSONAL EXPENSE TRACKER
// ==========================================



// ==========================================
// 1. GET HTML ELEMENTS
// ==========================================

const expenseForm =
    document.getElementById("expenseForm");

const descriptionInput =
    document.getElementById("description");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const expenseList =
    document.getElementById("expenseList");

const totalExpense =
    document.getElementById("totalExpense");

const totalTransactions =
    document.getElementById("totalTransactions");

const categorySummary =
    document.getElementById("categorySummary");

const submitButton =
    document.getElementById("submitButton");



// ==========================================
// 2. DELETE MODAL ELEMENTS
// ==========================================

const deleteModal =
    document.getElementById("deleteModal");

const cancelDelete =
    document.getElementById("cancelDelete");

const confirmDelete =
    document.getElementById("confirmDelete");



// ==========================================
// 3. EXPENSE DATA
// ==========================================

let expenses =
    JSON.parse(
        localStorage.getItem("expenses")
    ) || [];



// ==========================================
// 4. EDITING EXPENSE ID
// ==========================================

let editingExpenseId = null;



// ==========================================
// 5. EXPENSE TO DELETE
// ==========================================

let expenseToDelete = null;



// ==========================================
// 6. DISPLAY EXPENSES WHEN PAGE LOADS
// ==========================================

displayExpenses();



// ==========================================
// 7. ADD / UPDATE EXPENSE
// ==========================================

expenseForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const description =
            descriptionInput.value.trim();


        const amount =
            Number(amountInput.value);


        const category =
            categoryInput.value;


        const date =
            dateInput.value;



        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (
            description === "" ||
            amount <= 0 ||
            category === "" ||
            date === ""
        ) {

            alert(
                "Please enter all expense details."
            );

            return;

        }



        // =================================
        // UPDATE EXISTING EXPENSE
        // =================================

        if (editingExpenseId !== null) {

            const expenseIndex =
                expenses.findIndex(
                    function (expense) {

                        return (
                            expense.id ===
                            editingExpenseId
                        );

                    }
                );


            if (expenseIndex !== -1) {

                expenses[expenseIndex] = {

                    id: editingExpenseId,

                    description: description,

                    amount: amount,

                    category: category,

                    date: date

                };

            }


            editingExpenseId = null;


            submitButton.textContent =
                "+ Add Expense";

        }



        // =================================
        // ADD NEW EXPENSE
        // =================================

        else {

            const newExpense = {

                id: Date.now(),

                description: description,

                amount: amount,

                category: category,

                date: date

            };


            expenses.push(newExpense);

        }



        // =================================
        // SAVE DATA
        // =================================

        saveExpenses();



        // =================================
        // UPDATE DISPLAY
        // =================================

        displayExpenses();



        // =================================
        // CLEAR FORM
        // =================================

        expenseForm.reset();

    }
);



// ==========================================
// 8. SAVE EXPENSES
// ==========================================

function saveExpenses() {

    localStorage.setItem(

        "expenses",

        JSON.stringify(expenses)

    );

}



// ==========================================
// 9. DISPLAY EXPENSES
// ==========================================

function displayExpenses() {

    expenseList.innerHTML = "";



    // --------------------------------------
    // NO EXPENSE
    // --------------------------------------

    if (expenses.length === 0) {

        expenseList.innerHTML = `

            <p class="no-expense">

                No expenses added yet.
                Start tracking your spending!

            </p>

        `;


        updateSummary();

        updateCategorySummary();

        return;

    }



    // --------------------------------------
    // DISPLAY EACH EXPENSE
    // --------------------------------------

    expenses.forEach(
        function (expense) {


            const expenseItem =
                document.createElement("div");


            expenseItem.classList.add(
                "expense-item"
            );



            expenseItem.innerHTML = `

                <div class="expense-info">

                    <h3>
                        ${expense.description}
                    </h3>

                    <p>
                        Category:
                        ${expense.category}
                    </p>

                    <p>
                        Date:
                        ${expense.date}
                    </p>

                </div>


                <div class="expense-amount">

                    ₹${expense.amount}

                </div>


                <button
                    class="edit-button"
                    onclick="editExpense(${expense.id})"
                >

                    Edit

                </button>


                <button
                    class="delete-button"
                    onclick="deleteExpense(${expense.id})"
                >

                    Delete

                </button>

            `;



            expenseList.appendChild(
                expenseItem
            );

        }
    );



    updateSummary();

    updateCategorySummary();

}



// ==========================================
// 10. UPDATE TOTAL SUMMARY
// ==========================================

function updateSummary() {


    const total =
        expenses.reduce(
            function (sum, expense) {

                return (
                    sum +
                    expense.amount
                );

            },
            0
        );


    totalExpense.textContent =
        `₹${total}`;


    totalTransactions.textContent =
        expenses.length;

}



// ==========================================
// 11. CATEGORY SUMMARY
// ==========================================

function updateCategorySummary() {

    categorySummary.innerHTML = "";


    const categories = {};



    expenses.forEach(
        function (expense) {


            if (
                !categories[
                    expense.category
                ]
            ) {

                categories[
                    expense.category
                ] = 0;

            }


            categories[
                expense.category
            ] += expense.amount;

        }
    );



    Object.keys(categories).forEach(
        function (category) {


            const categoryCard =
                document.createElement(
                    "div"
                );


            categoryCard.classList.add(
                "category-card"
            );


            categoryCard.innerHTML = `

                <h4>
                    ${category}
                </h4>

                <p>
                    ₹${categories[category]}
                </p>

            `;


            categorySummary.appendChild(
                categoryCard
            );

        }
    );

}



// ==========================================
// 12. OPEN DELETE MODAL
// ==========================================

function deleteExpense(id) {

    expenseToDelete = id;


    deleteModal.classList.add(
        "show"
    );

}



// ==========================================
// 13. CANCEL DELETE
// ==========================================

cancelDelete.addEventListener(
    "click",
    function () {

        expenseToDelete = null;


        deleteModal.classList.remove(
            "show"
        );

    }
);



// ==========================================
// 14. CONFIRM DELETE
// ==========================================

confirmDelete.addEventListener(
    "click",
    function () {


        if (
            expenseToDelete === null
        ) {

            return;

        }



        expenses =
            expenses.filter(
                function (expense) {

                    return (
                        expense.id !==
                        expenseToDelete
                    );

                }
            );



        saveExpenses();


        displayExpenses();



        expenseToDelete = null;


        deleteModal.classList.remove(
            "show"
        );

    }
);



// ==========================================
// 15. EDIT EXPENSE
// ==========================================

function editExpense(id) {


    const expense =
        expenses.find(
            function (expense) {

                return (
                    expense.id === id
                );

            }
        );



    if (!expense) {

        return;

    }



    descriptionInput.value =
        expense.description;


    amountInput.value =
        expense.amount;


    categoryInput.value =
        expense.category;


    dateInput.value =
        expense.date;



    editingExpenseId = id;



    submitButton.textContent =
        "Update Expense";



    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}