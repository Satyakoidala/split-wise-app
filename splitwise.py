class User:

    def __init__(self, name, id):
        self.id = id
        self.name = name
        self.expenses = []
        self.total_money_spent = 0

    def note_expense(self, amount, note):
        expense = dict()
        expense["Notes"] = note
        expense["Amount"] = amount
        
        self.expenses.append(expense)
        self.total_money_spent += amount

class Users:

    def __init__(self, no_of_users):
        self.total_expense = 0
        self.no_of_users = no_of_users
        self.users = []
        for i in range(no_of_users):
            print(f'Type User {i+1} name:')
            name = input()
            self.users.append(User(name, i+1))

    def add_expense(self, userid, amount, note = "Miscellaneous"):
        self.total_expense += amount
        self.users[userid - 1].note_expense(amount, note)
        print("Expense added successfully..")

    def avg_expense_per_head(self):
        avg_per_head = self.total_expense / self.no_of_users
        print(f"Average Expense per head : {avg_per_head}")
        return avg_per_head

    def split_bill(self):
        print()
        print(f'Total Expenses combined : {self.total_expense}')

        avg_expense = self.avg_expense_per_head()

        for user in self.users:
            print()
            print(f'User {user.id} :')
            print(f'Name : {user.name}')
            for expense in user.expenses:
                note = expense['Notes']
                amount = expense['Amount']
                print(f'{note}: {amount}')
            print(f'Total Money Spent : {user.total_money_spent}')

            if user.total_money_spent > avg_expense:
                print(f"{user.name} has spent more money than avg..so this person should recieve {user.total_money_spent - avg_expense} rupees.")
            elif user.total_money_spent < avg_expense:
                print(f"{user.name} has spent less money than avg..so this person should pay {user.total_money_spent - avg_expense} rupees.")
            else:
                print(f"{user.name} has spent exactly the avg amount of money..so this person recieves nor payback any rupees.")



#driver code
print("Enter number of users : ", end='\t')
no_of_users = int(input())

users = Users(no_of_users)

def handle_expense_input():
    # msg print
    print()
    print("Tell me which user it is..?")
    for i in range(no_of_users):
        print(f'User {i+1}', end="\t")
    print()
    while True:
        userid = int(input())

        if (userid >=1) and (userid <=no_of_users):
            return userid
        else:
            print("Invalid ID.. Please proper ID number : ", end="\t")

def get_and_add_expense_details():
    # getting details for expense
    userid = handle_expense_input()

    print("Enter Amount : ", end="\t")
    amount = int(input())

    print("Enter Notes : ", end="\t")
    note = input()

    users.add_expense(userid, amount, note)



while True:
    print()
    print("Type 1. Note Expense, 2. Split Bill")
    action_code = int(input())

    if action_code == 1:
        get_and_add_expense_details()
    elif action_code == 2:
        #split bill
        users.split_bill()
        break
    else:
        print("Type valid action...")
