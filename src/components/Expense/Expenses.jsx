import { useEffect, useState } from "react";
import ExpenseForm from "./ExpenseForm";
import UpdateForm from "./UpdateForm";
import { useDispatch, useSelector } from "react-redux";
import { expensesActions } from "../../store/expenses";
import { themeActions } from "../../store/theme";

function Expenses() {
  const expenses = useSelector((state) => state.expense.expenses);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const userEmail = user.email?.replace(/\.|@/g, "");
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [data, setData] = useState({});

  const url = `https://expense-d1606-default-rtdb.firebaseio.com/${userEmail}/expense.json`;

  useEffect(() => {
    getExpenses();
    downloadFile();
  }, []);
  let amount = 0;
  expenses.forEach((expense) => {
    amount += Number(expense.amount);
  });
  const downloadFile = () => {
    let csvText = "";

    expenses.forEach((expense, index) => {
      if (!index) {
        return (csvText += `${["AMOUNT", "DESCRIPTION", "CATEGORY"].join(
          ","
        )}\r\n`);
      }

      const properValues = [
        expense.amount,
        expense.description,
        expense.category,
      ];
      return (csvText += `${properValues.join(",")}\r\n`);
    });
    const a = document.getElementById("download-file");
    const blob = new Blob([csvText]);
    a.href = URL.createObjectURL(blob);
  };

  const setDarkMode = () => {
    dispatch(themeActions.darkMode());
  };

  const getExpenses = () => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const arr = [];
        for (const key in data) {
          arr.push({
            id: key,
            amount: data[key].amount,
            description: data[key].description,
            category: data[key].category,
          });
        }
        dispatch(expensesActions.setExpenses(arr));
      });
  };

  const getData = (id) => {
    fetch(
      `https://expense-d1606-default-rtdb.firebaseio.com/${userEmail}/expense/${id}.json`
    )
      .then((res) => res.json())

      // .then((res) => res.json())
      .then((data) => {
        setId(id);
        setData(data);
        setShow((prev) => !prev);
      });
  };

  const addExpense = async (expense) => {
    const options = {
      method: "POST",
      body: JSON.stringify(expense),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      console.log(data);

      getExpenses();
    } catch (error) {
      console.error(error);
    }
  };
  const deleteExpense = (id) => {
    fetch(
      `https://expense-d1606-default-rtdb.firebaseio.com/${userEmail}/expense/${id}.json`,
      {
        method: "DELETE",
      }
    ).then(() => {
      console.log("Expense successfuly deleted");
    });
    const filteredExpenses = expenses.filter((expense) => expense.id != id);
    dispatch(expensesActions.setExpenses(filteredExpenses));
  };

  const editExpense = (expense, id) => {
    fetch(
      `https://expense-d1606-default-rtdb.firebaseio.com/${userEmail}/expense/${id}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(expense),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((data) => {
      console.log(data);
      getExpenses();
    });
  };
  return (
    <>
      {!show ? (
        <ExpenseForm addExpense={addExpense} />
      ) : (
        <UpdateForm edit={editExpense} data={data} setShow={setShow} id={id} />
      )}
      <h1
        style={{
          textTransform: "uppercase",
          textAlign: "center",
          color: "cornflowerblue",
        }}
      >
        Your Expenses{" "}
      </h1>

      <div
        style={{
          textAlign: "center",
          margin: "1rem",
        }}
      >
        <a id="download-file" download={"file.csv"}>
          {" "}
          Download File
        </a>
        {amount >= 1000 && (
          <button onClick={setDarkMode}>Activate Premium</button>
        )}
      </div>

      <section className="expenses">
        {expenses.length > 0 &&
          expenses.map((item) => (
            <article className="expense" key={item.id}>
              <h2>{item.description}</h2>
              <h3>{item.amount}</h3>
              <p>{item.category}</p>{" "}
              <div>
                {" "}
                <button className="edit" onClick={() => getData(item.id)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => deleteExpense(item.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
      </section>
    </>
  );
}
export default Expenses;
