import { useEffect, useState } from "react";
import ExpenseForm from "./ExpenseForm";
import UpdateForm from "./UpdateForm";
import { useDispatch, useSelector } from "react-redux";
import { expensesActions } from "../../store/expenses";

function Expenses() {
  const url = "https://expense-d1606-default-rtdb.firebaseio.com/expense.json";

  const expenses = useSelector((state) => state.expense.expenses);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [data, setData] = useState({});
  let amount = 0;
  expenses.forEach((expense) => {
    amount += Number(expense.amount);
  });
  useEffect(() => {
    getExpenses();
  }, []);

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
      `https://expense-d1606-default-rtdb.firebaseio.com/expense/${id}.json`
    )
      .then((res) => res.json())
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
      `https://expense-d1606-default-rtdb.firebaseio.com/expense/${id}.json`,
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
      ``,
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
      <ExpenseForm addExpense={onAdd} />
      <h1
        style={{
          textTransform: "uppercase",
          textAlign: "center",
          color: "cornflowerblue",
        }}
      >
        Your Expenses{" "}
        {amount > 1000 ? <button className="btn">Activate Premium</button> : ""}
      </h1>
      <section className="expenses">
        {expenses.map((item) => (
          <article className="expense" key={item.description}>
            <h2>{item.description}</h2>
            <h3>{item.amount}</h3>
            <p>{item.category}</p>
          </article>
        ))}
      </section>
    </>
  );
}
export default Expenses;
