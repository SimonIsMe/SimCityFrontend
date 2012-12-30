<?php

class Game 
{
    
    public $width = 20;
    public $height = 20;
    public $map = array();
    public $pollution = array();
    public $demand = array();
    public $money = 0;
    public $future = 0;
    public $demandI = 0;
    public $demandC = 0;
    public $demandR = 0;
    public $taxI = 9;
    public $taxC = 9;
    public $taxR = 9;
    public $population = array();
    public $pollutionAverage = 0;
    
    public function __construct() 
    {
        $_SESSION['id'] = 1;

        $f = fopen('./status/' . $_SESSION['id'] . '.txt', 'r');

        $this->width = (int) fgets($f);
        $this->height = (int) fgets($f);

        //  budynki, drogi na mapie
        $map = str_replace(chr(10), '', fgets($f));
        $map = str_split($map);
        for ($i = 0; $i < count($map); $i++) {
            $this->map[$i] = (int) $map[$i];
        }

        //  zanieczyszczenie
        $pollution = str_replace(chr(10), '', fgets($f));
        $pollution = str_split($pollution);
        for ($i = 0; $i < count($pollution); $i++) {
            $this->pollution[$i] = (int) $pollution[$i];
            $this->pollutionAverage += (int) $pollution[$i];
        }
        $this->pollutionAverage /= $this->width * $this->height;

        //  popyt
        $demand = str_replace(chr(10), '', fgets($f));
        $demand = str_split($demand);
        for ($i = 0; $i < count($demand); $i++) {
            $this->demand[$i] = (int) $demand[$i];
        }

        //  budżet
        $this->money = (float) fgets($f);

        //  budżet w przyszłości
        $this->future = (float) fgets($f);
        
        //  popyt na strefy
        $this->demandI = (int) fgets($f);
        $this->demandC = (int) fgets($f);
        $this->demandR = (int) fgets($f);
        
        //  podatki
        $this->taxI = (float) fgets($f);
        $this->taxC = (float) fgets($f);
        $this->taxR = (float) fgets($f);
        
        //  populacja
        $count = $this->width * $this->height;
        for($i = 0; $i < $count; $i++) {
            $this->population[] = (int) fgets($f);
        }
        
        fclose($f);
    }
    
    public function buildArea ($x_from, $y_from, $x_to, $y_to, $areaType) 
    {
        $width = abs($x_from - $x_to);
        $height = abs($y_from - $y_to);

        if ($x_from > $x_to) {
            $buffor = $x_from;
            $x_from = $x_to;
            $x_to = $buffor;
        }
        if ($y_from > $y_to) {
            $buffor = $y_from;
            $y_from = $y_to;
            $y_to = $buffor;
        }

        $position_x = array();
        $position_y = array();

        for ($y = $y_from; $y <= $y_to; $y++) {
            for ($x = $x_from; $x <= $x_to; $x++) {
                $position_x[] = $x;
                $position_y[] = $y;
            }
        }
        
        for($i = 0; $i < count($position_x); $i++) {
            $position = $position_x[$i] + $this->width * $position_y[$i];
            $this->map[$position] = $areaType;
        }
        
        $this->money -= ($width + 1) * ($height + 1) * 15;
        $this->save();
    }
    
    public function buildRoad ($x_from, $y_from, $x_to, $y_to) 
    {
        $width = abs($x_from - $x_to);
        $height = abs($y_from - $y_to);

        if ($x_from < $x_to) {
            $x_tmp_from = $x_from;
            $x_tmp_to = $x_to;
            $x2 = $x_from;
        } else {
            $x_tmp_from = $x_to;
            $x_tmp_to = $x_from;
            $x2 = $x_to;
        }

        if ($y_from <= $y_to) {
            $y_tmp_from = $y_from;
            $y_tmp_to = $y_to;
        } else {
            $y_tmp_from = $y_to;
            $y_tmp_to = $y_from;
        }

        $position_x = array();
        $position_y = array();

        if ($width > $height) {
            //  leży
            for ($x = $x_tmp_from; $x <= $x_tmp_to; $x++) {
                $position_x[] = $x;
                $position_y[] = $y_from;
            }
            for ($y = $y_tmp_from; $y <= $y_tmp_to; $y++) {
                $position_x[] = $x_to;
                $position_y[] = $y;
            }
        } else if ($width <= $height) {
            //  stoi lub kwadrat
            for ($x = $x_tmp_to; $x >= $x_tmp_from; $x--) {
                $position_x[] = $x;
                $position_y[] = $y_to;
            }
            for ($y = $y_tmp_to; $y >= $y_tmp_from; $y--) {
                $position_x[] = $x_from;
                $position_y[] = $y;
            }
        }
        
        for($i = 0; $i < count($position_x); $i++) {
            $position = $position_x[$i] + $this->width * $position_y[$i];
            if ($this->map[$position] > 4) {
                //  nie można wybudować drogi
                return false;
            }
        }
        
        for($i = 0; $i < count($position_x); $i++) {
            $position = $position_x[$i] + $this->width * $position_y[$i];
            $this->map[$position] = 1;
        }
        
        $areas = $width + $height + 1;
        $this->money -= $areas * 10;
        $this->future -= $areas * 0.3;
        
        $this->save();
        
        return true;
    }
    
    public function remove($x, $y)
    {
        $pos = $x + $this->width * $y;
        $this->map[$pos] = 0;
        $this->save();
    }
    
    /**
     * Zwraca tablicę z kluaczmi sąsiadów danego pola
     * 
     * @param int x
     * @param int y
     * @return int
     */
    private function getNeighbour($x, $y) 
    {
        if ($y > 0) {
            $q[2] = $x + $this->width * ($y - 1);
        }
        if ($x > 0) {
            $q[4] = $x - 1 + $this->width * $y;
            if ($y > 0) {
                $q[1] = $x - 1 + $this->width * ($y - 1);
            }
            if ($y < $this->height) {
                $q[6] = $x - 1 + $this->width * ($y + 1);
            }
        }
        //  $x[x] = $x + $this->width * $y;
        if ($x < $this->width) {
            $q[5] = $x + 1 + $this->width * $y;
            if ($y > 0) {
                $q[3] = $x + 1 + $this->width * ($y - 1);
            }
            if ($y < $this->height) {
                $q[8] = $x + 1 + $this->width * ($y + 1);
            }
        }
        
        if ($y < $this->height) {
            $q[7] = $x + $this->width * ($y + 1);
        }
        
        $toReturn = array();
        
        for ($i = 1; $i <= 7; $i++) {
            if ($q[$i] != null) {
                $toReturn[] = $q[$i];
            }
        }
        
        return $toReturn;
    }
    
    public function update() 
    {
        $this->updateRoad();
        $this->updateResidentalTax();
        $this->updateCommercialTax();
        $this->updateIndustryTax();
        
        $this->updateIndustryPollution();
        $this->updateResidentalPollution();
        $this->updateCommercialPollution();
        
        for($i = 0; $i < $this->width * $this->height; $i++) {
            if ($this->pollution[$i] < 0) {
                $this->pollution[$i] = 0;
            }
            if ($this->demand[$i] < 0) {
                $this->demand[$i] = 0;
            }
            if ($this->pollution[$i] > 9) {
                $this->pollution[$i] = 9;
            }
            if ($this->demand[$i] > 9) {
                $this->demand[$i] = 9;
            }
        }
        
        //  liczba mieszkańców i miejsc pracy
//        $workPlace = 0;
//        $people = 0;
//        for ($i = 0; $i < $this->width * $this->height; $i++) {
//            if ($this->map[$i] == 2) {
//                $people += $this->population[$i];
//            }
//            if ($this->map[$i] == 3 || $this->map[$i] == 4) {
//                $workPlace += $this->population[$i];
//            }
//        }
//        
//        if ($workPlace < $people) {
//            $this->demandR--;
//        }
        
        
        $this->updateResidentalDemand();
        $this->updateCommercialDemand();
        $this->updateIndustryDemand();
        
        $demandC_buffer = 10 - (int) $this->pollutionAverage;
        if ($demandC_buffer < $this->demandC) {
            $this->demandC = $demandC_buffer;
        }
        
        if ($this->demandI < -10) {
            $this->demandI = -10;
        }
        if ($this->demandI > 10) {
            $this->demandI = 10;
        }
        if ($this->demandC < -10) {
            $this->demandC = -10;
        }
        if ($this->demandC > 10) {
            $this->demandc = 10;
        }
        if ($this->demandR < -10) {
            $this->demandR = -10;
        }
        if ($this->demandR > 10) {
            $this->demandR = 10;
        }
        
        $this->updateResidentalPopulation();
        $this->updateCommercialPopulation();
        $this->updateIndustryPopulation();
        
        $this->save();
    }
    
    //  TODO: sprawdzić
    private function updateIndustryPollution()
    {
        for ($i = 0; $i < $this->width * $this->height; $i++) {
            if ($this->map[$i] == 4) {
                $x = $i % $this->width;
                $y = ($i - $x) / $this->height;
                $around = $this->getNeighbour($x, $y);
                
                switch ($this->population[$i])
                {
                    case 0:
                        $pollution = 0;
                        break;
                    case 20:
                        $pollution = 0.1;
                        break;
                    case 40:
                        $pollution = 0.13;
                        break;
                    case 60:
                        $pollution = 0.16;
                        break;
                    case 80:
                        $pollution = 0.19;
                        break;
                    case 100:
                        $pollution = 0.22;
                        break;
                }
                
                foreach($around as $id) {
                    $this->pollution[$id] += $pollution / 3;
                }
                $this->pollution[$i] += $pollution;
            }
        }
    }
    
    //  TODO
    private function updateResidentalPollution()
    {
        for ($i = 0; $i < $this->width * $this->height; $i++) {
            if ($this->map[$i] == 2) {
                $x = $i % $this->width;
                $y = ($i - $x) / $this->height;
                $around = $this->getNeighbour($x, $y);
//                foreach($around as $id) {
//                    $this->pollution[$id] += 0.005;
//                }
                $this->pollution[$i] += 0.01;
            }
        }
    }
    
    private function updateResidentalDemand()
    {
        
    }
    
    private function updateCommercialDemand()
    {
        
    }
    
    private function updateIndustryDemand()
    {
        $people = 0;
        for ($i = 0; $i < $this->width * $this->height; $i++) {
            if ($this->map[$i] == 2) {
                $people += $this->population[$i];
            }
        }
        
        //  określam maxymalny akceptowany podatek w zależności od liczby mieszkańców (rozmiarów miasta)
        if ($people < 10000) {
            $maxTax = 9;
        } else if ($people < 100000) {
            $maxTax = 10;
        } else if ($people < 1000000) {
            $maxTax = 11;
        }
        
        $percent = $this->taxI / $maxTax;
        
        $this->demandI = 10 - ($percent * 5);
    }
    
    private function updateResidentalPopulation() 
    {
        for ($i = 0; $i < $this->width * $this->height; $i++) {
            if ($this->map[$i] == 2) {
                
            }
        }
    }
    
    private function updateCommercialPopulation() 
    {
        
    }
    
    private function updateCommercialPollution() 
    {
        for ($i = 0; $i < $this->width * $this->height; $i++) {
            if ($this->map[$i] == 3) {
                if (rand(0,10) < $this->population[$i]) {
                    $this->pollution[$i] += 1;
                }
            }
        }
    }
    
    private function updateIndustryPopulation() 
    {
        $add = 0;
        if (round(0, 10) < abs($this->demandI)) {
            $add = 20;
        }
        
        if ($this->demandI < 0) {
            $add = (-1) * $add;
        }
        
        for ($i = 0; $i < $this->width * $this->height; $i++) {
            if ($this->map[$i] == 4) {
                $this->population[$i] += $add;
            }
        }
    }
    
    private function updateCommercialTax()
    {
        for ($i = 0; $i < $this->width * $this->height; $i++) {
            if ($this->map[$i] == 3) {
                $this->money += $this->taxC * $this->population[$i];
                $this->future += $this->taxC * $this->population[$i];
            }
        }
    }
    
    private function updateResidentalTax()
    {
        for ($i = 0; $i < $this->width * $this->height; $i++) {
            if ($this->map[$i] == 2) {
                $this->money += $this->taxR * $this->population[$i];
                $this->future += $this->taxR * $this->population[$i];
            }
        }
    }
    
    private function updateIndustryTax() 
    {
        for ($i = 0; $i < $this->width * $this->height; $i++) {
            if ($this->map[$i] == 4) {
                $this->money += $this->taxI * $this->population[$i];
                $this->future += $this->taxI * $this->population[$i];
            }
        }
    }
    
    private function updateRoad()
    {
        for ($i = 0; $i < $this->width * $this->height; $i++) {
            if ($this->map[$i] == 1) {
                $this->money -= 0.3;
                $this->future -= 0.3;

                //  aktualizuje zanieczyszczenie w danym kwadracie
                if(rand(0,100) < 40) {
                    $this->pollution[$i] += 1;
                }
                    
                $x = $i % $this->width;
                $y = ($i - $x) / $this->width;
                $around = $this->getNeighbour($x, $y);
                $this->demand[$i] += 5;
                foreach($around as $key) {
                    //  zanieczyszczenie
                    if(rand(0,100) < 20) {
                        $this->pollution[$key] += 1;
                    }
                    
                    //  popyt
                    $this->demand[$key] += 6;
                }
            }
        }
    }
    
    public function save() 
    {
        $f = fopen('./status/' . $_SESSION['id'] . '.txt', 'w');
        
        fwrite($f, $this->width . chr(10),  3);
        fwrite($f, $this->height . chr(10),  3);
        fwrite($f, implode($this->map) . chr(10),  count($this->map) + 1);
        fwrite($f, implode($this->pollution) . chr(10),  count($this->pollution) + 1);
        fwrite($f, implode($this->demand) . chr(10),  count($this->demand) + 1);
        fwrite($f, $this->money . chr(10), strlen($this->money) + 1);
        fwrite($f, $this->future . chr(10), strlen($this->future) + 1);
        
        //  popyt na strefy
        fwrite($f, $this->demandI . chr(10), strlen($this->demandI) + 1);
        fwrite($f, $this->demandC . chr(10), strlen($this->demandC) + 1);
        fwrite($f, $this->demandR . chr(10), strlen($this->demandR) + 1);
        
        //  podatki
        fwrite($f, $this->taxI . chr(10), strlen($this->taxI) + 1);
        fwrite($f, $this->taxC . chr(10), strlen($this->taxC) + 1);
        fwrite($f, $this->taxR . chr(10), strlen($this->taxR) + 1);
        
        //  populacja
        $count = $this->width * $this->height;
        for($i = 0; $i < $count; $i++) {
            fwrite($f, $this->population[$i] . chr(10), strlen($this->population[$i]) + 1);
        }

        fclose($f);
    }
    
    
    
}