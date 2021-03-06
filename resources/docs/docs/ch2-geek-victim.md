# Chapter 2: Getting around the LoRa node and sending location

## Briefing

Alright John. Focus.  
You have just a few % of battery left.
  
The LoRa device you found was probably used for something else than sending your location. 
Connect it to your computer, input the correct settings to join the remote LoRa Network, and send your location.  
That's it. It's **THAT** simple!
 
## Step 1 - Connect to LoRa Network

Years ago, when you were still a student, you built a cool Location sending app along with a Serial terminal.
Let's reuse this as a codebase. 

You will use OTAA (Over-The-Air Activation) and therefore must set a certain number of parameters inside your device.

OTAA requires three parameters:

 * a DevEUI (this one does **not** need to be changed)
 * an AppEUI (this one needs to be changed)
 * an AppKey (this one needs to be changed)

All Modems are controlled using what we call AT Commands. Fortunately, you also had printed the [documentation of your LoRa Node device](/resources/course/lora-node-guide.pdf)!

Remember what Trinity said in her text: She wants you to change all settings to "42".

That means:

 1. Set the LoRa Node Mode to LoRaWAN
 2. Set the AppEUI to "4242424242424242"
 3. Set the AppKey to "42424242424242424242424242424242"

The boilerplate code was already done in your project. That's a real time-saver.

Unfortunately, you did not know anything about AT Commands so you didn't really implement it... 

**==> Implement the code in `src/tobeimpl/step1.js` and use the relevant AT Commands and payload.**    

Last but not least, you have to actually send the joinRequest in OTAA mode. And wait for the LoRa Network to accept it.  
If you get an answer, you need to be sure it's a JoinRequest Success answer so you can unlock step 1.

**Important**:

Hint 1:  
Make sure your ports were already open (UNIX-based), otherwise go back to Game Guide "Before you Start" section. 

Hint 2:  
You will need the **WisNode RAK811 manual**

Hint 3:  
Don't forget to use the GUI and hit "Join Network". 


## Step 3 - Send your location

Almost done. Your device was registered on the LoRa Network.
The only thing left to do is to send your location. 

However, this one requires to make a bit of binary calculations.    

Chances are that the LoRa Network uses the CayenneLPP protocol to communicate, since it is widely used for sensor data.
  
Good thing is, you have a full documentation of the CayenneLPP protocol and samples in your great LoRaWAN 101 course.

Bad thing is : you need to implement it yourself.

Hurry up, you're almost there!

**==> Implement the code in `src/tobeimpl/step2.js`**

We have implemented tests for you, don't hesitate to use `npm test`

**Important**:

Hint 1:  
You will need the **LoRaWAN 101 Course** manual

Hint 2:  
Test using `npm test`

Hint 3:
Once all tests are green, don't forget to use the GUI and hit the **Send Location** button.
