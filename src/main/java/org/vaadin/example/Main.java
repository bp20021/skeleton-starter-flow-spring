package org.vaadin.example;


import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;

import com.vaadin.flow.component.dependency.CssImport;

import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.PWA;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.concurrent.atomic.AtomicInteger;

@Route
@PWA(name = "Vaadin Application",
        shortName = "Vaadin App",
        description = "This is an example Vaadin application.",
        enableInstallPrompt = false)
@CssImport("./styles/shared-styles.css")
@CssImport(value = "./styles/vaadin-text-field-styles.css", themeFor = "vaadin-text-field")
public class Main extends VerticalLayout {
    UI ui;
    
    static final AtomicInteger count23 = new AtomicInteger(0);


    public Main(@Autowired GreetService service) {

        VerticalLayout countBox = new VerticalLayout();
        
        TextField count1Field = new TextField();
        TextField count2Field = new TextField();
               
        Button countButton = new Button("Count1 Start");
        Button countButton2 = new Button("Count2 Start");
        
        this.ui = UI.getCurrent();
        
        add(
         new HorizontalLayout(
            count1Field,
            count2Field,
            countButton,
            countButton2
         ),
         countBox
        );

        

        countButton.addClickListener(click -> {
           
            


           int c1 = Integer.parseInt(count1Field.getValue().toString());
           int c2 = Integer.parseInt(count2Field.getValue().toString()); 
           
           

           Counter counter = new Counter();

           Thread t1 = new Thread(() -> {
                for (int i = 0 ; i<10 ; i++) {
                    this.ui.access(() -> {
                        counter.countup(countBox,c1); 
                    });                            
            }
        });

           t1.start(); 

           
           Thread t2 = new Thread(() -> {

            for (int i = 0 ; i<10 ; i++) {
                this.ui.access(() -> {
                    counter.countup(countBox,c2); 
                }); 
                               
            }
           });

           t2.start();          
        
           
           

        });

        countButton2.addClickListener(click -> {
            int c1 = Integer.parseInt(count1Field.getValue().toString());
            int c2 = Integer.parseInt(count2Field.getValue().toString());
            
             

            Runnable counter2 = () -> {
                while(count23.get() <= 10 * (c1+c2)){
                    this.ui.access(() -> {
                      try{
                        count23.getAndAdd(c1);
                        countBox.add(count23 + " ");
                        Thread.sleep(c2*1000);
                      } catch (InterruptedException e){

                      }
                    });
                } 
            
            };
            Runnable counter3 = () -> {
                while(count23.get() <= 10 * (c1+c2)){
                    this.ui.access(() -> {
                      try{
                        count23.getAndAdd(c2);
                        countBox.add(count23 + " ");
                        Thread.sleep(c1*1000);
                      } catch (InterruptedException e){

                      }
                    });
                } 
            };

            new Thread(counter2).start();
            new Thread(counter3).start();

        });

    }

}
