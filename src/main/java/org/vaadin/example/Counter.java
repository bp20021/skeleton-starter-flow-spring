package org.vaadin.example;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;


public class Counter {
    public Integer count = 0;

    public void countup(VerticalLayout countBox, int c) {
        synchronized(this){
          this.count = this.count + c;
        
          countBox.add(this.count.toString() + " ");
        }
        
    }
}
