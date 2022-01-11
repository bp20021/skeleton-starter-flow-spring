package org.vaadin.example;


import com.vaadin.flow.component.button.Button;

import com.vaadin.flow.component.dependency.CssImport;

import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.PWA;
import org.springframework.beans.factory.annotation.Autowired;
import com.vaadin.flow.component.html.Label;

@Route
@PWA(name = "Vaadin Application",
        shortName = "Vaadin App",
        description = "This is an example Vaadin application.",
        enableInstallPrompt = false)
@CssImport("./styles/shared-styles.css")
@CssImport(value = "./styles/vaadin-text-field-styles.css", themeFor = "vaadin-text-field")
public class Main extends VerticalLayout {


    public Main(@Autowired GreetService service) {

        VerticalLayout countBox = new VerticalLayout();
        
        TextField count1Field = new TextField();
        TextField count2Field = new TextField();
               
        Button countButton = new Button("CountStart");
        
        
        

        add(
         new HorizontalLayout(
            count1Field,
            count2Field,
            countButton
            
         ),
         countBox
        );

        

        countButton.addClickListener(click -> {
           
            


           int c1 = Integer.parseInt(count1Field.getValue().toString());
           int c2 = Integer.parseInt(count2Field.getValue().toString()); 
           
           

           Counter counter = new Counter();

           Thread t1 = new Thread(() -> {

            for (int i = 0 ; i<10000 ; i++) {
                counter.countup(countBox,c1); 
            }   
                         
           });

           t1.start(); 

           
           /*Thread t2 = new Thread(() -> {

            for (int i = 0 ; i<10000 ; i++) {
                counter.countup(countBox,c2);                
            }
           });

           t2.start();*/           
        
           
           

        });

    }

}
