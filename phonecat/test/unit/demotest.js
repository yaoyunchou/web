/**
 * Created by yaoyc on 2015/10/30.
 */

describe('PhoneCat controllers', function() {

    describe('phonelistCrtl', function(){
        beforeEach(function() {
            browser().navigateTo('app/demo01.html');
        });
        it('有几个iphone', function() {
            expect(repeater('.demophone li').count()).toBe(4);
        });
    });
});